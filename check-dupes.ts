import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  const counts = {};
  snap.forEach(d => {
    const data = d.data();
    const key = `${data.rollNo}-${data.semester}-${data.examType}`;
    if (!counts[key]) counts[key] = [];
    counts[key].push(d.id);
  });
  
  for (const key in counts) {
    if (counts[key].length > 1) {
      console.log(`DUPLICATES FOUND for ${key}:`, counts[key]);
    }
  }
  console.log('Done checking duplicates.');
  process.exit(0);
}
run();
