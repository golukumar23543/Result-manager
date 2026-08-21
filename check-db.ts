import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  console.log(`Found ${snap.size} documents in 'results' collection.`);
  if (snap.size > 0) {
    console.log(snap.docs[0].data());
  }
}
run();
