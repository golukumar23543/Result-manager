import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  const grouped = new Map();
  snap.forEach(doc => {
    const data = doc.data();
    // Group by rollNo and examType
    const key = `${data.rollNo}_${data.examType}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push({ id: doc.id, ...data });
  });
  
  let deletedCount = 0;
  for (const [key, docs] of grouped.entries()) {
    if (docs.length > 1) {
      // Sort to keep the one with pdfData if available, otherwise just keep the first
      docs.sort((a, b) => {
        if (a.pdfData && !b.pdfData) return -1;
        if (!a.pdfData && b.pdfData) return 1;
        return 0;
      });
      // Delete duplicates (keep the first one)
      for (let i = 1; i < docs.length; i++) {
        await deleteDoc(doc(db, 'results', docs[i].id));
        deletedCount++;
        console.log(`Deleted duplicate record: ${docs[i].id} for ${key}`);
      }
    }
  }
  console.log(`Successfully deleted ${deletedCount} duplicate records.`);
  process.exit(0);
}
run();
