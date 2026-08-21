import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    await addDoc(collection(db, 'results'), {
      rollNo: '211891825036',
      name: 'ANSHU KUMAR',
      semester: 'Semester 2',
      examType: 'Regular',
      totalMarks: 621,
      sgpa: 6.21,
      carrySubjects: 'APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B, PROGRAMMING WITH C',
      clearStatus: 'Not Cleared',
      pdfData: '',
      profileImage: '',
      createdAt: serverTimestamp()
    });
    console.log('Successfully added Anshu Kumar record.');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
