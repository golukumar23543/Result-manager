import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const rawText = `
NIDHI KUMARI 211891825056 739 7.80 First Class
SHAURYA SINGH 211891825055 683 Carry in - APPLIED CHEMISTRY -B, PROGRAMMING WITH C
SHAMBHAVI KARN 211891825054 688 Carry in - APPLIED MATHEMATICS -B, PROGRAMMING WITH C
PALLAVI SINHA 211891825053 448 Pending
PRANAV KUMAR 211891825052 717 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B
ABHAY KUMAR 211891825051 750 7.90 First Class with Distinction (U/R)
RISHABH PATEL 211891825050 752 8.00 First Class with Distinction
ADITYA ARYA 211891825049 680 Carry in - APPLIED CHEMISTRY -B, PROGRAMMING WITH C
PRADEEP KUMAR 211891825048 677 Fail
ROMA KUMARI 211891825046 666 Fail
ALOK KUMAR 211891825044 665 Fail
RAUSHAN KUMAR 211891825043 635 Pending
ANIMESH KUMAR 211891825042 667 Fail
PRITAM RAJ 211891825041 690 Carry in - APPLIED CHEMISTRY -B, PROGRAMMING WITH C
ROHIT KUMAR 211891825040 639 Fail
PIYUSH KUMAR 211891825039 712 Carry in - PROGRAMMING WITH C
AAYUSHI SINGH 211891825038 700 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B, PROGRAMMING WITH C
ANKIT RANJAN 211891825037 667 Fail
SHASHANK KUMAR SHARMA 211891825035 663 Fail
MUSKAN KUMARI 211891825034 747 Carry in - APPLIED MATHEMATICS -B, PROGRAMMING WITH C
NAVODITA KUMARI 211891825033 669 Fail
NANDANI RAJ 211891825032 760 8.07 First Class with Distinction
NISHA KUMARI 211891825031 736 7.80 First Class (U/R)
RIYA KUMARI 211891825030 763 8.13 First Class with Distinction
SHIVAM KUMAR 211891825029 661 Fail
UTSAV SANDILYA 211891825028 661 Fail
AYANSH SINGH 211891825027 717 Carry in - APPLIED CHEMISTRY -B
RAVI RANJAN MURARI 211891825025 637 Fail
SATYAM KUMAR 211891825023 665 Fail
PRINCE KUMAR 211891825022 758 8.20 First Class with Distinction
PRIYANSHU RAJ 211891825020 645 Fail
ROSHNI BHARTI 211891825018 721 Carry in - APPLIED CHEMISTRY -B, COMMUNICATION SKILLS (ENGLISH), APPLIED MATHEMATICS -B
SACHIN PANDEY 211891825017 596 Pending
SANDHYA KUMARI 211891825016 719 7.70 First Class
NUTAN KUMARI 211891825015 695 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B
ADITYA RAJ 211891825014 653 Fail
HIMANSHU KUMAR 211891825013 695 Carry in - APPLIED MATHEMATICS -B
SURYA PRAKASH SINGH 211891825012 771 8.20 First Class with Distinction
KUMARI VIDISHA 211891825011 719 Carry in - APPLIED MATHEMATICS -B
SATYAM SAURABH 211891825010 696 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B
RADHA KUMARI 211891825009 655 Fail
ARFIN NAZ 211891825007 733 Carry in - APPLIED MATHEMATICS -B
TULIKA TANMAY 211891825006 688 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B
YUVRAJ KUMAR 211891825005 681 Carry in - APPLIED CHEMISTRY -B, APPLIED MATHEMATICS -B
MUSKAN KUMARI 211891825004 719 Carry in - APPLIED MATHEMATICS -B
JITENDRA KUMAR SHARMA 211891825003 659 Fail
SHRUTI KUMARI 211891825002 768 8.20 First Class with Distinction
SHRISTY PATHAK 211891825001 749 7.97 First Class
`;

// Helper to determine status and carry string
function parseStatus(rest) {
  if (rest.includes("Fail") || rest.includes("Pending")) {
    return { status: "Partially Cleared", carry: "Unknown (Fail/Pending)" };
  }
  if (rest.includes("Carry in -")) {
    const carry = rest.split("Carry in -")[1].trim();
    return { status: "Partially Cleared", carry: carry };
  }
  return { status: "Cleared", carry: "" };
}

function parseSgpa(rest) {
  const match = rest.match(/(\d\.\d{2})/);
  if (match) return parseFloat(match[1]);
  return null;
}

const records = rawText.trim().split('\n').map(line => {
  const parts = line.split(' ');
  const rollNoOriginal = parts.find(p => p.startsWith('21189182'));
  const name = line.substring(0, line.indexOf(rollNoOriginal)).trim();
  const rest = line.substring(line.indexOf(rollNoOriginal) + rollNoOriginal.length).trim();
  const totalMarksMatch = rest.match(/^\d{3}/);
  const totalMarks = totalMarksMatch ? parseInt(totalMarksMatch[0]) : null;
  const sgpa = parseSgpa(rest);
  const { status, carry } = parseStatus(rest);
  
  const last2 = rollNoOriginal.slice(-2);
  const formattedRollNo = `892510${last2}`;
  
  return {
    rollNo: formattedRollNo,
    name: name,
    totalMarks,
    sgpa,
    status,
    carry
  };
});

async function run() {
  try {
    // 1. Update existing records rollNo
    const snap = await getDocs(collection(db, 'results'));
    let updateCount = 0;
    for (const docSnapshot of snap.docs) {
      const data = docSnapshot.data();
      if (data.rollNo && data.rollNo.length >= 2 && !data.rollNo.startsWith('892510')) {
        const last2 = data.rollNo.slice(-2);
        await updateDoc(doc(db, 'results', docSnapshot.id), {
          rollNo: `892510${last2}`
        });
        updateCount++;
      }
    }
    console.log(`Updated ${updateCount} existing records to new Roll No format.`);

    // 2. Add new records
    console.log(`Adding ${records.length} new records to Firestore...`);
    let addCount = 0;
    
    for (const record of records) {
      await addDoc(collection(db, 'results'), {
        rollNo: record.rollNo,
        name: record.name,
        semester: 'Semester 2',
        examType: 'Regular', // Final exam
        totalMarks: record.totalMarks,
        sgpa: record.sgpa,
        clearStatus: record.status,
        carrySubjects: record.carry,
        createdAt: serverTimestamp(),
        pdfData: '',
        profileImage: ''
      });
      addCount++;
    }
    
    console.log(`Successfully added ${addCount} regular results!`);
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}

run();
