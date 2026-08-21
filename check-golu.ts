import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(query(collection(db, 'results'), where('rollNo', '==', '89251024')));
  console.log(`Found ${snap.size} records for 89251024:`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, Sem: ${data.semester}, Exam: ${data.examType}, SGPA: ${data.sgpa}, Carry: ${data.carrySubjects}`);
  });
  
  // also check how many records in total there are
  const allSnap = await getDocs(collection(db, 'results'));
  const grouped = new Map();
  allSnap.forEach(doc => {
    const r = doc.data().rollNo;
    if(!grouped.has(r)) grouped.set(r, []);
    grouped.get(r).push(doc.data());
  });
  const golu = grouped.get('89251024');
  console.log(`golu in all records: ${golu?.length}`);
  
  process.exit(0);
}
run();
