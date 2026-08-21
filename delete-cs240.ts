import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, 'results'));
    let deleteCount = 0;
    
    for (const document of snap.docs) {
      const data = document.data();
      if (data.rollNo && data.rollNo.toUpperCase().startsWith('CS24')) {
        await deleteDoc(doc(db, 'results', document.id));
        deleteCount++;
      }
    }
    console.log(`Successfully deleted ${deleteCount} records starting with CS24.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to delete records:", err);
    process.exit(1);
  }
}
run();
