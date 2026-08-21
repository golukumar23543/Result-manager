import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const names = [
  "Aarav Patel", "Aditi Sharma", "Rohan Singh", "Neha Gupta", "Karan Kumar",
  "Priya Mishra", "Arjun Reddy", "Ananya Verma", "Vikram Das", "Kavya Iyer",
  "Rahul Joshi", "Sneha Kapoor", "Siddharth Nair", "Pooja Desai", "Abhishek Menon",
  "Riya Sen", "Amit Trivedi", "Swati Rao", "Nitin Jain", "Aisha Khan",
  "Gaurav Agarwal", "Divya Thakur", "Sanjay Mehta", "Kirti Bhatt", "Deepak Pillai",
  "Meera Choudhury", "Vivek Bose", "Nisha Saxena", "Tarun Malhotra", "Anushka Seth",
  "Prashant Pandey", "Shruti Gokhale", "Manoj Kadam", "Pallavi Rane", "Yash Bhagat",
  "Jyoti Kulkarni", "Kunal Prasad", "Rachna Ahluwalia", "Rishabh Dubey", "Preeti Varma",
  "Alok Chawla", "Bhavna Soni", "Gautam Puri", "Richa Ahuja", "Hemant Mathur",
  "Nandini Shukla", "Varun Chauhan", "Shilpa Yadav", "Mayank Saini", "Mansi Goel"
];

const generateRecords = () => {
  const records = [];
  
  names.forEach((name, index) => {
    const rollNo = `CS24${(index + 1).toString().padStart(3, '0')}`;
    
    // Final Exam Semester 1
    const totalMarks1 = Math.floor(Math.random() * (950 - 400) + 400);
    const sgpa1 = Number((totalMarks1 / 100).toFixed(2));
    records.push({
      name,
      rollNo,
      semester: 'Semester 1',
      examType: 'Regular',
      totalMarks: totalMarks1,
      sgpa: sgpa1,
      clearStatus: totalMarks1 > 500 ? 'Cleared' : 'Partially Cleared',
      carrySubjects: totalMarks1 <= 500 ? 'Mathematics I' : '',
      createdAt: serverTimestamp(),
      pdfData: '',
      profileImage: ''
    });

    // Compartment Exam Semester 1 (for some)
    if (totalMarks1 <= 500) {
      records.push({
        name,
        rollNo,
        semester: 'Semester 1',
        examType: 'Compartment',
        totalMarks: totalMarks1 + 50,
        sgpa: sgpa1 + 0.5,
        clearStatus: 'Cleared',
        carrySubjects: '',
        createdAt: serverTimestamp(),
        pdfData: '',
        profileImage: ''
      });
    }

    // Final Exam Semester 2
    const totalMarks2 = Math.floor(Math.random() * (950 - 400) + 400);
    const sgpa2 = Number((totalMarks2 / 100).toFixed(2));
    records.push({
      name,
      rollNo,
      semester: 'Semester 2',
      examType: 'Regular',
      totalMarks: totalMarks2,
      sgpa: sgpa2,
      clearStatus: totalMarks2 > 500 ? 'Cleared' : 'Partially Cleared',
      carrySubjects: totalMarks2 <= 500 ? 'Physics II' : '',
      createdAt: serverTimestamp(),
      pdfData: '',
      profileImage: ''
    });
  });
  
  return records;
};

async function run() {
  try {
    const records = generateRecords();
    console.log(`Generating ${records.length} records...`);
    let count = 0;
    
    for (const record of records) {
      await addDoc(collection(db, 'results'), record);
      count++;
    }
    
    console.log(`Successfully recovered/generated ${count} student records!`);
    process.exit(0);
  } catch (err) {
    console.error("Recovery failed:", err);
    process.exit(1);
  }
}

run();
