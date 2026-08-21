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
    if (data.pdfData && data.pdfData.length > 0) {
      await updateDoc(doc(db, 'results', document.id), {
        pdfData: ''
      });
      updatedCount++;
    }
  }
  console.log(`Cleared PDF data for ${updatedCount} records.`);
  process.exit(0);
}
run();
