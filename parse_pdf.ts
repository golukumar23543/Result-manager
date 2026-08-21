import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const rawText = `
Registration No : 1891825024
Roll No : 221891825024
Following are the marks obtained by GOLU KUMAR
GRAND TOTAL 30 1000 759
SGPA 8.71
REMARKS : Pass

Registration No : 1891825055
Roll No : 221891825055
Following are the marks obtained by SHAURYA SINGH
GRAND TOTAL 30 1000 712
SGPA 7.88
REMARKS : Pass

Registration No : 1891825054
Roll No : 221891825054
Following are the marks obtained by SHAMBHAVI KARN
GRAND TOTAL 30 1000 698
REMARKS : Carry in - APPLIED MATHEMATICS -B
Pass in - PROGRAMMING WITH C

Registration No : 1891825053
Roll No : 221891825053
Following are the marks obtained by PALLAVI SINHA
GRAND TOTAL 30 1000 654
REMARKS : Pending
THEORY PAPERS
APPLIED CHEMISTRY -B 3.0 30 70 100 28 40 27 12 39 F
COMMUNICATION SKILLS (ENGLISH) 3.0 30 70 100 28 40 28 29 57 D
APPLIED MATHEMATICS -B 3.0 30 70 100 28 40 25 - - F

Registration No : 1891825052
Roll No : 221891825052
Following are the marks obtained by PRANAV KUMAR
GRAND TOTAL 30 1000 754
SGPA 8.54
REMARKS : Pass

Registration No : 1891825049
Roll No : 221891825049
Following are the marks obtained by ADITYA ARYA
GRAND TOTAL 30 1000 713
REMARKS : Carry in - APPLIED CHEMISTRY -B
Pass in - PROGRAMMING WITH C

Registration No : 1891825046
Roll No : 221891825046
Following are the marks obtained by ROMA KUMARI
GRAND TOTAL 30 1000 720
REMARKS : Carry in - APPLIED CHEMISTRY -B
APPLIED MATHEMATICS -B

Registration No : 1891825044
Roll No : 221891825044
Following are the marks obtained by ALOK KUMAR
GRAND TOTAL 30 1000 705
REMARKS : Carry in - APPLIED CHEMISTRY -B

Registration No : 1891825043
Roll No : 221891825043
Following are the marks obtained by RAUSHAN KUMAR
GRAND TOTAL 30 1000 688
REMARKS : Carry in - APPLIED CHEMISTRY -B
COMMUNICATION SKILLS (ENGLISH)

Registration No : 1891825042
Roll No : 221891825042
Following are the marks obtained by ANIMESH KUMAR
GRAND TOTAL 30 1000 734
SGPA 7.93
REMARKS : First Class

Registration No : 1891825041
Roll No : 221891825041
Following are the marks obtained by PRITAM RAJ
GRAND TOTAL 30 1000 716
SGPA 7.88
REMARKS : Pass

Registration No : 1891825040
Roll No : 221891825040
Following are the marks obtained by ROHIT KUMAR
GRAND TOTAL 30 1000 677
REMARKS : Carry in - APPLIED CHEMISTRY -B
COMMUNICATION SKILLS (ENGLISH)
PROGRAMMING WITH C

Registration No : 1891825039
Roll No : 221891825039
Following are the marks obtained by PIYUSH KUMAR
GRAND TOTAL 30 1000 712
REMARKS : Carry in - PROGRAMMING WITH C

Registration No : 1891825038
Roll No : 221891825038
Following are the marks obtained by AAYUSHI SINGH
GRAND TOTAL 30 1000 756
SGPA 8.81
REMARKS : Pass

Registration No : 1891825037
Roll No : 221891825037
Following are the marks obtained by ANKIT RANJAN
GRAND TOTAL 30 1000 686
REMARKS : Fail

Registration No : 1891825035
Roll No : 221891825035
Following are the marks obtained by SHASHANK KUMAR SHARMA
GRAND TOTAL 30 1000 757
SGPA 8.13
REMARKS : First Class with Distinction

Registration No : 1891825034
Roll No : 221891825034
Following are the marks obtained by MUSKAN KUMARI
GRAND TOTAL 30 1000 777
SGPA 8.79
REMARKS : Pass

Registration No : 1891825033
Roll No : 221891825033
Following are the marks obtained by NAVODITA KUMARI
GRAND TOTAL 30 1000 686
REMARKS : Fail

Registration No : 1891825029
Roll No : 221891825029
Following are the marks obtained by SHIVAM KUMAR
GRAND TOTAL 30 1000 689
REMARKS : Carry in - APPLIED CHEMISTRY -B

Registration No : 1891825028
Roll No : 221891825028
Following are the marks obtained by UTSAV SANDILYA
GRAND TOTAL 30 1000 686
REMARKS : Carry in - APPLIED CHEMISTRY -B
APPLIED MATHEMATICS -B
PROGRAMMING WITH C

Registration No : 1891825027
Roll No : 221891825027
Following are the marks obtained by AYANSH SINGH
GRAND TOTAL 30 1000 741
SGPA 7.89
REMARKS : Pass

Registration No : 1891825025
Roll No : 221891825025
Following are the marks obtained by RAVI RANJAN MURARI
GRAND TOTAL 30 1000 696
REMARKS : Carry in - APPLIED CHEMISTRY -B

Registration No : 1891825018
Roll No : 221891825018
Following are the marks obtained by ROSHNI BHARTI
GRAND TOTAL 30 1000 756
REMARKS : Carry in - APPLIED MATHEMATICS -B
Pass in - APPLIED CHEMISTRY -B
COMMUNICATION SKILLS (ENGLISH)

Registration No : 1891825017
Roll No : 221891825017
Following are the marks obtained by SACHIN PANDEY
GRAND TOTAL 30 1000 658
REMARKS : Fail

Registration No : 1891825015
Roll No : 221891825015
Following are the marks obtained by NUTAN KUMARI
GRAND TOTAL 30 1000 706
REMARKS : Carry in - APPLIED CHEMISTRY -B
Pass in - APPLIED MATHEMATICS -B

Registration No : 1891825014
Roll No : 221891825014
Following are the marks obtained by ADITYA RAJ
GRAND TOTAL 30 1000 690
REMARKS : Carry in - APPLIED CHEMISTRY -B

Registration No : 1891825013
Roll No : 221891825013
Following are the marks obtained by HIMANSHU KUMAR
GRAND TOTAL 30 1000 685
REMARKS : Pending

Registration No : 1891825011
Roll No : 221891825011
Following are the marks obtained by KUMARI VIDISHA
GRAND TOTAL 30 1000 729
SGPA 8.00
REMARKS : Pass

Registration No : 1891825010
Roll No : 221891825010
Following are the marks obtained by SATYAM SAURABH
GRAND TOTAL 30 1000 692
REMARKS : Carry in - APPLIED CHEMISTRY -B
APPLIED MATHEMATICS -B

Registration No : 1891825009
Roll No : 221891825009
Following are the marks obtained by RADHA KUMARI
GRAND TOTAL 30 1000 645
REMARKS : Fail

Registration No : 1891825007
Roll No : 221891825007
Following are the marks obtained by ARFIN NAZ
GRAND TOTAL 30 1000 758
SGPA 8.33
REMARKS : Pass

Registration No : 1891825006
Roll No : 221891825006
Following are the marks obtained by TULIKA TANMAY
GRAND TOTAL 30 1000 658
REMARKS : Carry in - APPLIED CHEMISTRY -B
APPLIED MATHEMATICS -B

Registration No : 1891825005
Roll No : 221891825005
Following are the marks obtained by YUVRAJ KUMAR
GRAND TOTAL 30 1000 714
REMARKS : Carry in - APPLIED MATHEMATICS -B
Pass in - APPLIED CHEMISTRY -B

Registration No : 1891825004
Roll No : 221891825004
Following are the marks obtained by MUSKAN KUMARI
GRAND TOTAL 30 1000 739
SGPA 8.07
REMARKS : Pass

Registration No : 1891825003
Roll No : 221891825003
Following are the marks obtained by JITENDRA KUMAR SHARMA
GRAND TOTAL 30 1000 661
REMARKS : Fail
`;

const records = [
  { rollNo: "221891825024", name: "GOLU KUMAR", totalMarks: 759, sgpa: 8.71, status: "Cleared", carry: "" },
  { rollNo: "221891825055", name: "SHAURYA SINGH", totalMarks: 712, sgpa: 7.88, status: "Cleared", carry: "" },
  { rollNo: "221891825054", name: "SHAMBHAVI KARN", totalMarks: 698, sgpa: null, status: "Partially Cleared", carry: "APPLIED MATHEMATICS -B" },
  { rollNo: "221891825053", name: "PALLAVI SINHA", totalMarks: 654, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825052", name: "PRANAV KUMAR", totalMarks: 754, sgpa: 8.54, status: "Cleared", carry: "" },
  { rollNo: "221891825049", name: "ADITYA ARYA", totalMarks: 713, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825046", name: "ROMA KUMARI", totalMarks: 720, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825044", name: "ALOK KUMAR", totalMarks: 705, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825043", name: "RAUSHAN KUMAR", totalMarks: 688, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, COMMUNICATION SKILLS (ENGLISH)" },
  { rollNo: "221891825042", name: "ANIMESH KUMAR", totalMarks: 734, sgpa: 7.93, status: "Cleared", carry: "" },
  { rollNo: "221891825041", name: "PRITAM RAJ", totalMarks: 716, sgpa: 7.88, status: "Cleared", carry: "" },
  { rollNo: "221891825040", name: "ROHIT KUMAR", totalMarks: 677, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, COMMUNICATION SKILLS (ENGLISH), PROGRAMMING WITH C" },
  { rollNo: "221891825039", name: "PIYUSH KUMAR", totalMarks: 712, sgpa: null, status: "Partially Cleared", carry: "PROGRAMMING WITH C" },
  { rollNo: "221891825038", name: "AAYUSHI SINGH", totalMarks: 756, sgpa: 8.81, status: "Cleared", carry: "" },
  { rollNo: "221891825037", name: "ANKIT RANJAN", totalMarks: 686, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825035", name: "SHASHANK KUMAR SHARMA", totalMarks: 757, sgpa: 8.13, status: "Cleared", carry: "" },
  { rollNo: "221891825034", name: "MUSKAN KUMARI", totalMarks: 777, sgpa: 8.79, status: "Cleared", carry: "" },
  { rollNo: "221891825033", name: "NAVODITA KUMARI", totalMarks: 686, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825029", name: "SHIVAM KUMAR", totalMarks: 689, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825028", name: "UTSAV SANDILYA", totalMarks: 686, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B, PROGRAMMING WITH C" },
  { rollNo: "221891825027", name: "AYANSH SINGH", totalMarks: 741, sgpa: 7.89, status: "Cleared", carry: "" },
  { rollNo: "221891825025", name: "RAVI RANJAN MURARI", totalMarks: 696, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825018", name: "ROSHNI BHARTI", totalMarks: 756, sgpa: null, status: "Partially Cleared", carry: "APPLIED MATHEMATICS -B" },
  { rollNo: "221891825017", name: "SACHIN PANDEY", totalMarks: 658, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825015", name: "NUTAN KUMARI", totalMarks: 706, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825014", name: "ADITYA RAJ", totalMarks: 690, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B" },
  { rollNo: "221891825013", name: "HIMANSHU KUMAR", totalMarks: 685, sgpa: null, status: "Partially Cleared", carry: "APPLIED MATHEMATICS -B" },
  { rollNo: "221891825011", name: "KUMARI VIDISHA", totalMarks: 729, sgpa: 8.00, status: "Cleared", carry: "" },
  { rollNo: "221891825010", name: "SATYAM SAURABH", totalMarks: 692, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825009", name: "RADHA KUMARI", totalMarks: 645, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825007", name: "ARFIN NAZ", totalMarks: 758, sgpa: 8.33, status: "Cleared", carry: "" },
  { rollNo: "221891825006", name: "TULIKA TANMAY", totalMarks: 658, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B" },
  { rollNo: "221891825005", name: "YUVRAJ KUMAR", totalMarks: 714, sgpa: null, status: "Partially Cleared", carry: "APPLIED MATHEMATICS -B" },
  { rollNo: "221891825004", name: "MUSKAN KUMARI", totalMarks: 739, sgpa: 8.07, status: "Cleared", carry: "" },
  { rollNo: "221891825003", name: "JITENDRA KUMAR SHARMA", totalMarks: 661, sgpa: null, status: "Partially Cleared", carry: "APPLIED CHEMISTRY -B, PROGRAMMING WITH C" }
];

async function run() {
  try {
    console.log(`Adding ${records.length} records to Firestore...`);
    let count = 0;
    
    for (const record of records) {
      await addDoc(collection(db, 'results'), {
        rollNo: record.rollNo,
        name: record.name,
        semester: 'Semester 2',
        examType: 'Compartment',
        totalMarks: record.totalMarks,
        sgpa: record.sgpa,
        clearStatus: record.status,
        carrySubjects: record.carry,
        createdAt: serverTimestamp(),
        pdfData: '',
        profileImage: ''
      });
      count++;
    }
    
    console.log(`Successfully added ${count} compartment results!`);
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}

run();
