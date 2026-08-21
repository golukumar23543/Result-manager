import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  if (!snap.empty) {
    console.log('Trying to delete:', snap.docs[0].id);
    await deleteDoc(doc(db, 'results', snap.docs[0].id));
    console.log('Deleted');
  }
  process.exit(0);
}
run();
