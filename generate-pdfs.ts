import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  let updatedCount = 0;

  for (const document of snap.docs) {
    const data = document.data();
    
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const { width, height } = page.getSize();
    
    page.drawText('STATE BOARD OF TECHNICAL EDUCATION, BIHAR', {
      x: 100,
      y: height - 50,
      size: 16,
      font: timesBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('(PROVISIONAL RESULT)', {
      x: 200,
      y: height - 75,
      size: 12,
      font: timesBold,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Roll No : ${data.rollNo}`, { x: 50, y: height - 120, size: 12, font: timesRomanFont });
    page.drawText(`Name    : ${data.name}`, { x: 50, y: height - 140, size: 12, font: timesRomanFont });
    page.drawText(`Exam    : 2nd Semester (${data.examType || 'Regular'})`, { x: 50, y: height - 160, size: 12, font: timesRomanFont });

    page.drawLine({
      start: { x: 50, y: height - 190 },
      end: { x: 545, y: height - 190 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawText(`GRAND TOTAL: ${data.totalMarks || 'N/A'} / 1000`, { x: 50, y: height - 220, size: 14, font: timesBold });
    if (data.sgpa) {
      page.drawText(`SGPA: ${data.sgpa}`, { x: 50, y: height - 250, size: 14, font: timesBold });
    }
    
    const statusText = data.clearStatus === 'Cleared' ? 'Pass' : (data.clearStatus === 'Partially Cleared' ? 'Carry' : 'Fail');
    page.drawText(`REMARKS: ${statusText}`, { x: 50, y: height - 280, size: 14, font: timesBold });
    
    if (data.carrySubjects) {
      page.drawText(`Carry In: ${data.carrySubjects}`, { x: 50, y: height - 310, size: 12, font: timesRomanFont, color: rgb(0.8, 0, 0) });
    }

    page.drawText('This is an auto-generated digital provisional document.', { x: 50, y: 50, size: 10, font: timesRomanFont });

    // Serialize the PDFDocument to base64
    const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

    // Update the document
    await updateDoc(doc(db, 'results', document.id), {
      pdfData: pdfBytes
    });
    
    updatedCount++;
  }
  
  console.log(`Generated and attached PDFs for ${updatedCount} records.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
