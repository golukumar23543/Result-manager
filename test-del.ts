import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const res = await addDoc(collection(db, 'results'), { rollNo: 'test' });
  console.log('Added:', res.id);
  await deleteDoc(doc(db, 'results', res.id));
  console.log('Deleted:', res.id);
  process.exit(0);
}
run();
