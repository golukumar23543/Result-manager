import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const q = query(collection(db, 'results'), where('rollNo', '==', '211891825036'));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.log('No document found with rollNo 211891825036');
      process.exit(0);
    }

    for (const d of snap.docs) {
      await updateDoc(doc(db, 'results', d.id), {
        rollNo: '89251036'
      });
      console.log(`Updated document ${d.id} rollNo to 89251036`);
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
