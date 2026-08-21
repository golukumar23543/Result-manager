import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, 'results'));
  const grouped = new Map();
  snap.forEach(doc => {
    const data = doc.data();
    if (!grouped.has(data.rollNo)) {
      grouped.set(data.rollNo, []);
    }
    grouped.get(data.rollNo).push({ id: doc.id, ...data });
  });
  
  for (const [roll, docs] of grouped.entries()) {
    if (docs.length > 2) {
      console.log(`Roll ${roll} has ${docs.length} results:`);
      docs.forEach(d => console.log(`  - ID: ${d.id}, Sem: ${d.semester}, Exam: ${d.examType}, SGPA: ${d.sgpa}`));
    }
  }
}
run();
