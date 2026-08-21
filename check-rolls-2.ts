import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  console.log(`Found ${snap.size} documents.`);
  const rolls = new Set();
  snap.forEach(doc => rolls.add(doc.data().rollNo));
  console.log("Existing Roll Nos:", Array.from(rolls).slice(0, 10));
}
run();
