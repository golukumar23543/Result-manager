import { useState, useEffect, useRef, FormEvent, useMemo, ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  Search,
  Save,
  Trash2,
  X,
  GraduationCap,
  XCircle,
  FileText,
  Upload,
  Download,
  User,
  BookOpen,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

interface Result {
  id?: string;
  rollNo: string;
  name: string;
  semester?: string;
  examType?: string;
  totalMarks: number | null;
  sgpa: number | null;
  carrySubjects: string;
  clearStatus: string;
  pdfData?: string;
  profileImage?: string;
  studentPassword?: string;
  createdAt?: any;
}

interface StudentGroup {
  rollNo: string;
  collegeRollNo: string;
  name: string;
  profileImage?: string;
  studentPassword?: string;
  results: Result[];
}

export const getCollegeRollNo = (roll: string): string => {
  if (!roll) return '';
  const trimmed = roll.trim();
  const numMatch = trimmed.match(/(\d+)$/);
  if (numMatch) {
    const digits = numMatch[1];
    if (trimmed.startsWith('892510') && digits.length >= 2) {
      return digits.slice(-2);
    }
    if (digits.length >= 2) {
      return digits.slice(-2);
    }
    return digits.padStart(2, '0');
  }
  return trimmed;
};

export default function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Student unlock states
  const [unlockedStudentRolls, setUnlockedStudentRolls] = useState<Set<string>>(new Set());
  const [studentAuthTarget, setStudentAuthTarget] = useState<StudentGroup | null>(null);
  const [studentPassInput, setStudentPassInput] = useState('');
  const [studentPassError, setStudentPassError] = useState('');
  const [showStudentPass, setShowStudentPass] = useState(false);

  // Admin Modals & State
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [pendingEditRec, setPendingEditRec] = useState<Result | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentGroup | null>(null);
  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);
  const [pendingInlinePdf, setPendingInlinePdf] = useState<{
    base64: string;
    student: StudentGroup;
    semester: string;
    examType: string;
    existingId: string | null;
  } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [examType, setExamType] = useState('Regular');
  const [totalMarks, setTotalMarks] = useState<string>('');
  const [sgpa, setSgpa] = useState<string>('');
  const [carrySubjects, setCarrySubjects] = useState('');
  const [clearStatus, setClearStatus] = useState('Cleared');
  const [pdfData, setPdfData] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Result[] = [];
        snapshot.forEach((d) => {
          data.push({ id: d.id, ...d.data() } as Result);
        });
        setResults(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore Error:', error);
        setErrorMsg('Firebase Error! Please check your connection.');
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAdminAlert = (msg: string, isError: boolean) => {
    if (isError) {
      setErrorMsg(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setErrorMsg('');
    }
    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 3500);
  };

  const openAdminWithRecord = (rec?: Result | null) => {
    resetForm();
    if (rec) {
      if (rec.id) setEditId(rec.id);
      if (rec.rollNo) {
        setRollNo(rec.rollNo);
        setStudentPassword(rec.studentPassword || rec.rollNo);
      }
      if (rec.name) setStudentName(rec.name);
      if (rec.semester) setSemester(rec.semester);
      if (rec.examType) setExamType(rec.examType);
      if (rec.totalMarks !== undefined && rec.totalMarks !== null) setTotalMarks(rec.totalMarks.toString());
      if (rec.sgpa !== undefined && rec.sgpa !== null) setSgpa(rec.sgpa.toString());
      if (rec.carrySubjects) setCarrySubjects(rec.carrySubjects);
      if (rec.clearStatus) setClearStatus(rec.clearStatus);
      if (rec.pdfData) setPdfData(rec.pdfData);
    }
    setIsAdminOpen(true);
  };

  const uploadProfileImage = async (base64Image: string) => {
    if (!selectedStudent) return;
    try {
      const updates = selectedStudent.results.map(r =>
        updateDoc(doc(db, 'results', r.id!), { profileImage: base64Image })
      );
      await Promise.all(updates);
      setSelectedStudent(prev => prev ? { ...prev, profileImage: base64Image } : prev);
      setPendingProfileImage(null);
      handleAdminAlert('✅ Profile photo updated!', false);
    } catch (err) {
      console.error(err);
      handleAdminAlert('❌ Failed to update photo', true);
      setPendingProfileImage(null);
    }
  };

  // Triple-click on graduation cap to open Admin Panel
  const capClickCountRef = useRef(0);
  const capClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCapClick = (e: MouseEvent) => {
    e.stopPropagation();

    // Browser native triple click detection
    if (e.detail === 3) {
      capClickCountRef.current = 0;
      if (capClickTimerRef.current) clearTimeout(capClickTimerRef.current);
      handleOpenAdmin();
      return;
    }

    // Manual sequential click counter (allows 3 clicks within 1.2s)
    capClickCountRef.current += 1;
    if (capClickTimerRef.current) {
      clearTimeout(capClickTimerRef.current);
    }

    if (capClickCountRef.current >= 3) {
      capClickCountRef.current = 0;
      handleOpenAdmin();
    } else {
      capClickTimerRef.current = setTimeout(() => {
        capClickCountRef.current = 0;
      }, 1200);
    }
  };

  const handleOpenAdmin = (rec?: Result | MouseEvent | SyntheticEvent) => {
    const editRec = (rec && !('nativeEvent' in rec)) ? (rec as Result) : null;
    
    if (isAdminAuthenticated) {
      openAdminWithRecord(editRec);
    } else {
      setPendingEditRec(editRec);
      setIsAdminPasswordModalOpen(true);
    }
  };

  const handleAdminPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'golu@12') {
      setIsAdminAuthenticated(true);
      setIsAdminPasswordModalOpen(false);
      setAdminPasswordInput('');
      setAdminPasswordError('');
      
      if (pendingProfileImage) {
        await uploadProfileImage(pendingProfileImage);
        return;
      }

      if (pendingInlinePdf) {
        await processInlinePdf(pendingInlinePdf);
        return;
      }

      if (pendingDeleteId) {
        try {
          await deleteDoc(doc(db, 'results', pendingDeleteId));
          handleAdminAlert('✅ Result deleted!', false);
        } catch (err) {
          handleAdminAlert('❌ Failed to delete result!', true);
        }
        setPendingDeleteId(null);
        return;
      }

      openAdminWithRecord(pendingEditRec);
    } else {
      setAdminPasswordError('Incorrect admin password');
    }
  };

  const handleStudentClick = (student: StudentGroup) => {
    // If admin is already authenticated or student is already unlocked in this session
    if (isAdminAuthenticated || unlockedStudentRolls.has(student.rollNo)) {
      setSelectedStudent(student);
      return;
    }
    // Prompt student for password
    setStudentAuthTarget(student);
    setStudentPassInput('');
    setStudentPassError('');
    setShowStudentPass(false);
  };

  const handleStudentAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!studentAuthTarget) return;

    const input = studentPassInput.trim();
    const customPass = studentAuthTarget.studentPassword?.trim();
    const fullRoll = studentAuthTarget.rollNo.trim();

    // Student password MUST be the full roll number (e.g. 89251001, 89251002...) or custom password set by admin.
    // Serial number (01, 02) is NOT allowed to unlock.
    const isMatch =
      input.toLowerCase() === fullRoll.toLowerCase() ||
      (customPass && input.toLowerCase() === customPass.toLowerCase()) ||
      input === 'golu@12';

    if (isMatch) {
      setUnlockedStudentRolls(prev => new Set(prev).add(studentAuthTarget.rollNo));
      setSelectedStudent(studentAuthTarget);
      setStudentAuthTarget(null);
      setStudentPassInput('');
      setStudentPassError('');
      handleAdminAlert(`✅ Welcome, ${studentAuthTarget.name}! Profile unlocked.`, false);
    } else {
      setStudentPassError('❌ Incorrect Password! Please enter the correct Roll No or Password.');
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !studentName.trim()) {
      handleAdminAlert('Roll No and Name are required!', true);
      return;
    }

    let formattedRollNo = rollNo.trim();
    if (formattedRollNo.length <= 3 && !isNaN(Number(formattedRollNo))) {
      let suffix = formattedRollNo;
      if (suffix.length === 1) {
        suffix = '0' + suffix;
      }
      formattedRollNo = '892510' + suffix;
    }

    const tMarks = totalMarks ? parseFloat(totalMarks) : null;
    let sMarks = sgpa ? parseFloat(sgpa) : null;

    if (tMarks !== null && sMarks === null) {
      sMarks = tMarks / 100;
      sMarks = Math.round(sMarks * 100) / 100;
    }

    const passToSave = studentPassword.trim() || formattedRollNo;

    const record: any = {
      rollNo: formattedRollNo,
      name: studentName,
      semester,
      examType,
      totalMarks: tMarks,
      sgpa: sMarks,
      carrySubjects,
      clearStatus,
      studentPassword: passToSave
    };
    
    if (pdfData) {
      record.pdfData = pdfData;
    } else {
      record.pdfData = '';
    }

    try {
      if (editId) {
        await updateDoc(doc(db, 'results', editId), record);
        
        // Also update password across all other records for this student to keep it synced
        const studentOtherResults = results.filter(r => r.rollNo === formattedRollNo && r.id !== editId);
        if (studentOtherResults.length > 0) {
          await Promise.all(
            studentOtherResults.map(r => updateDoc(doc(db, 'results', r.id!), { studentPassword: passToSave }))
          );
        }

        handleAdminAlert('✅ Record & Password updated!', false);
      } else {
        await addDoc(collection(db, 'results'), {
          ...record,
          createdAt: serverTimestamp(),
        });
        handleAdminAlert('✅ Record added with student password!', false);
      }
      resetForm();
    } catch (err: any) {
      if (err.message) {
         handleAdminAlert('❌ ' + err.message, true);
      } else {
         handleAdminAlert('❌ Failed to save!', true);
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setRollNo('');
    setStudentName('');
    setStudentPassword('');
    setSemester('Semester 1');
    setExamType('Regular');
    setTotalMarks('');
    setSgpa('');
    setCarrySubjects('');
    setClearStatus('Cleared');
    setPdfData('');
  };

  const processInlinePdf = async (data: NonNullable<typeof pendingInlinePdf>) => {
    try {
      const colRoll = getCollegeRollNo(data.student.rollNo);
      const studentPass = data.student.studentPassword || colRoll;

      if (data.existingId) {
        await updateDoc(doc(db, 'results', data.existingId), { pdfData: data.base64 });
        handleAdminAlert('✅ PDF Updated successfully!', false);
      } else {
        await addDoc(collection(db, 'results'), {
          rollNo: data.student.rollNo,
          name: data.student.name,
          semester: data.semester,
          examType: data.examType,
          totalMarks: null,
          sgpa: null,
          carrySubjects: '',
          clearStatus: 'Cleared',
          pdfData: data.base64,
          profileImage: data.student.profileImage || '',
          studentPassword: studentPass,
          createdAt: serverTimestamp()
        });
        handleAdminAlert('✅ Result Created with PDF!', false);
      }
      setPendingInlinePdf(null);
    } catch (err) {
      console.error(err);
      handleAdminAlert('❌ Failed to upload PDF', true);
      setPendingInlinePdf(null);
    }
  };

  const handleInlinePdfSelect = (e: ChangeEvent<HTMLInputElement>, student: StudentGroup, sem: string, type: string, existingId: string | null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      handleAdminAlert('Please select a PDF file', true);
      e.target.value = '';
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      handleAdminAlert('PDF must be under 1.5MB', true);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const data = { base64, student, semester: sem, examType: type, existingId };
      
      if (isAdminAuthenticated) {
        await processInlinePdf(data);
      } else {
        setPendingInlinePdf(data);
        setIsAdminPasswordModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleProfileImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      handleAdminAlert('File size must be under 2.5MB', true);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (isAdminAuthenticated) {
        await uploadProfileImage(base64);
      } else {
        setPendingProfileImage(base64);
        setIsAdminPasswordModalOpen(true);
      }
    };
    reader.onerror = () => {
      handleAdminAlert('Failed to read image file', true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      handleAdminAlert('Please select a PDF file', true);
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      handleAdminAlert('File size must be under 1.5MB', true);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfData(event.target?.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      handleAdminAlert('Failed to read file', true);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const downloadPdf = (e: MouseEvent, base64Data?: string, rNo?: string) => {
    e.stopPropagation();
    if (!base64Data) return;
    
    try {
      const byteString = atob(base64Data.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Result_${rNo || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      const a = document.createElement('a');
      a.href = base64Data;
      a.download = `Result_${rNo || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const openPdf = (e: MouseEvent, base64Data?: string) => {
    e.stopPropagation();
    if (!base64Data) return;
    
    try {
      const byteString = atob(base64Data.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error opening PDF:', err);
      window.open(base64Data, '_blank');
    }
  };

  const handleDeleteResult = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (!isAdminAuthenticated) {
      handleAdminAlert('Please login as admin to delete records', true);
      setPendingDeleteId(id);
      setIsAdminPasswordModalOpen(true);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'results', id));
      handleAdminAlert('✅ Result deleted!', false);
    } catch (err) {
      handleAdminAlert('❌ Failed to delete result!', true);
    }
  };

  const groupedStudents = useMemo(() => {
    const groups = new Map<string, StudentGroup>();
    results.forEach(r => {
      const colRoll = getCollegeRollNo(r.rollNo);
      const s = searchTerm.toLowerCase().trim();
      
      const numColRoll = parseInt(colRoll, 10).toString();
      const matches = 
        !s ||
        r.rollNo.toLowerCase().includes(s) ||
        colRoll.toLowerCase().includes(s) ||
        numColRoll === s ||
        r.name.toLowerCase().includes(s);

      if (!matches) return;

      if (!groups.has(r.rollNo)) {
        groups.set(r.rollNo, {
          rollNo: r.rollNo,
          collegeRollNo: colRoll,
          name: r.name,
          results: [],
          profileImage: r.profileImage,
          studentPassword: r.studentPassword || r.rollNo
        });
      } else {
        const existing = groups.get(r.rollNo)!;
        if (r.profileImage && !existing.profileImage) {
          existing.profileImage = r.profileImage;
        }
        if (r.studentPassword && (!existing.studentPassword || existing.studentPassword === r.rollNo)) {
          existing.studentPassword = r.studentPassword;
        }
      }
      groups.get(r.rollNo)!.results.push(r);
    });

    // Natural numeric sort by College Roll (01, 02, 03... 56)
    return Array.from(groups.values()).sort((a, b) => {
      const numA = parseInt(a.collegeRollNo, 10);
      const numB = parseInt(b.collegeRollNo, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.collegeRollNo.localeCompare(b.collegeRollNo);
    });
  }, [results, searchTerm]);

  useEffect(() => {
    if (selectedStudent) {
      const fresh = groupedStudents.find(g => g.rollNo === selectedStudent.rollNo);
      if (fresh) {
        if (fresh !== selectedStudent) setSelectedStudent(fresh);
      } else {
        setSelectedStudent(null);
      }
    }
  }, [groupedStudents, selectedStudent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] to-[#0f172f] text-slate-200 p-3 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <header className="bg-slate-800/80 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-sky-400/30 shadow-xl backdrop-blur-sm">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent select-none flex items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={handleCapClick}
                className="relative group p-1 -m-1 rounded-xl hover:bg-slate-700/50 active:scale-90 transition-all text-sky-400 focus:outline-none cursor-pointer"
                title="Admin Panel (Click 3 times to open)"
                aria-label="Admin Panel"
              >
                <GraduationCap className="w-9 h-9 transition-transform group-hover:scale-110 group-active:scale-95" />
                {isAdminAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </button>
              <span>Result & Profile Manager</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Serial No (01, 02, 03...) | Password Protected Profiles | Real-time Database
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 px-3.5 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5 transition-colors"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Admin Logout</span>
              </button>
            )}
            <div className="bg-slate-900 border border-sky-500/40 text-sky-300 px-4 py-2 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(56,189,248,0.15)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Password Protected</span>
            </div>
            <div className="bg-slate-900 border border-sky-400 text-sky-400 px-5 py-2 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              👥 Students: {groupedStudents.length}
            </div>
          </div>
        </header>

        {/* Main Student Section */}
        <main className="bg-slate-900/85 border border-sky-400/25 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold border-l-4 border-sky-400 pl-4 flex items-center gap-2">
              📋 Student Profiles
            </h2>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Password Protected
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Roll No (01, 02..) or Student Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-600 text-sm sm:text-base"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-5 py-3 rounded-2xl transition-colors font-medium whitespace-nowrap text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-700/60 shadow-inner">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
              <thead>
                <tr className="bg-slate-800/90 text-sky-200 border-b border-slate-700 text-xs sm:text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-28 text-center">College Roll</th>
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold w-36 text-center">Records</th>
                  <th className="p-4 font-semibold w-40 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sky-400/80 animate-pulse">
                      🔄 Loading student records from Firebase...
                    </td>
                  </tr>
                ) : groupedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      📭 No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  groupedStudents.map((student) => {
                    const isUnlocked = isAdminAuthenticated || unlockedStudentRolls.has(student.rollNo);

                    return (
                      <tr
                        key={student.rollNo}
                        className="hover:bg-sky-500/5 transition-colors cursor-pointer group"
                        onClick={() => handleStudentClick(student)}
                      >
                        {/* College Roll Serial Badge (01, 02, 03...) */}
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.2rem] px-2.5 py-1 bg-amber-500/10 text-amber-300 group-hover:bg-amber-500/20 border border-amber-500/30 font-mono font-bold rounded-lg text-sm transition-colors shadow-sm">
                            {student.collegeRollNo}
                          </span>
                        </td>

                        {/* Student Name */}
                        <td className="p-4 font-medium text-slate-100 flex items-center gap-3">
                          {student.profileImage ? (
                            <img
                              src={student.profileImage}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-slate-700/60 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/60 shrink-0">
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <span className="truncate max-w-[180px] sm:max-w-xs">{student.name}</span>
                        </td>

                        {/* Total Records */}
                        <td className="p-4 text-center">
                          <span className="bg-[#0f3b4c] text-sky-300 px-3 py-1 rounded-full text-xs font-semibold border border-sky-400/20">
                            {student.results.length} Semesters
                          </span>
                        </td>

                        {/* Action / Lock Status */}
                        <td className="p-4 text-right">
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                              <Unlock className="w-3.5 h-3.5" /> View Profile &rarr;
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-semibold bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 group-hover:bg-sky-500/20 transition-all">
                              <Lock className="w-3.5 h-3.5 text-amber-400" /> Unlock &rarr;
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Global Toast Alert */}
      {(errorMsg || successMsg) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
          <div
            className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 ${
              errorMsg
                ? 'bg-rose-950/95 border-rose-800 text-rose-200'
                : 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
            }`}
          >
             {errorMsg ? (
               <XCircle className="w-5 h-5 shrink-0 text-rose-400" />
             ) : (
               <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</div>
             )}
             <span>{errorMsg || successMsg}</span>
          </div>
        </div>
      )}

      {/* Student Profile Password Verification Modal */}
      {studentAuthTarget && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-md rounded-2xl md:rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                {studentAuthTarget.profileImage ? (
                  <img
                    src={studentAuthTarget.profileImage}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-sky-400/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-sky-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{studentAuthTarget.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      College Roll: {studentAuthTarget.collegeRollNo}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setStudentAuthTarget(null);
                  setStudentPassInput('');
                  setStudentPassError('');
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-5 flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-100 mb-0.5">Profile Locked for Privacy</p>
                <p>Apna profile unlock karne ke liye apna <strong>Roll No / Password</strong> enter karein.</p>
              </div>
            </div>

            <form onSubmit={handleStudentAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  <span>Enter Roll No / Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showStudentPass ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter your Roll No / Password"
                    value={studentPassInput}
                    onChange={(e) => {
                      setStudentPassInput(e.target.value);
                      if (studentPassError) setStudentPassError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl px-4 py-3 pr-11 text-slate-100 placeholder:text-slate-600 transition-all outline-none font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPass(!showStudentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showStudentPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {studentPassError && (
                  <p className="text-rose-400 text-xs sm:text-sm mt-2 ml-1 animate-pulse font-medium">
                    {studentPassError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unlock Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Password Modal Overlay */}
      {isAdminPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[65] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-sm rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2">
                <Key className="w-5 h-5" /> Admin Access
              </h2>
              <button
                onClick={() => {
                  setIsAdminPasswordModalOpen(false);
                  setAdminPasswordInput('');
                  setAdminPasswordError('');
                  setPendingProfileImage(null);
                  setPendingDeleteId(null);
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Admin Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter admin password"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 pr-11 placeholder:text-slate-600 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {adminPasswordError && (
                  <p className="text-rose-400 text-sm mt-2 ml-1">{adminPasswordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25"
              >
                Verify & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-4xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            
            {/* Profile Header */}
            <div className="flex justify-between items-start mb-5 sm:mb-6 shrink-0 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative group">
                  {selectedStudent.profileImage ? (
                    <img
                      src={selectedStudent.profileImage}
                      alt={selectedStudent.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-sky-500/50 shadow-lg"
                    />
                  ) : (
                    <div className="bg-sky-500/20 p-2 sm:p-3 rounded-2xl border border-sky-500/30 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg">
                      <User className="w-7 h-7 sm:w-9 sm:h-9 text-sky-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm border border-sky-400/50">
                    <Upload className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageSelect} />
                  </label>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 truncate max-w-[200px] sm:max-w-[400px]">
                    {selectedStudent.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      College Roll: {selectedStudent.collegeRollNo}
                    </span>
                    <span className="text-slate-400 font-mono text-xs sm:text-sm">
                      Exam Roll: {selectedStudent.rollNo}
                    </span>
                    {isAdminAuthenticated && (
                      <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        🔑 Pass: {selectedStudent.studentPassword || selectedStudent.rollNo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800 bg-slate-800/50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Semesters Grid */}
            <div className="overflow-y-auto pr-2 pb-4 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(sem => {
                  const semResults = selectedStudent.results.filter(r => (r.semester || 'Semester 1') === sem);
                  
                  return (
                    <div key={sem} className="bg-slate-950/50 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-bold text-lg text-indigo-100">{sem}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {['Regular', 'Compartment'].map(type => {
                          const res = semResults.find(r => (r.examType || 'Regular') === type);
                          const displayName = type === 'Regular' ? 'Final Exam Result' : 'Compartment Exam Result';
                          
                          if (!res) {
                            return (
                              <div key={type} className="border border-dashed border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/20">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${type === 'Regular' ? 'bg-sky-500/50' : 'bg-purple-500/50'}`}></span>
                                  <span className="text-slate-500 text-sm font-medium">{displayName} Pending</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                  <label className="flex-1 sm:flex-none text-emerald-400 hover:text-emerald-300 text-xs font-bold px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 border border-emerald-500/20 whitespace-nowrap">
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload PDF
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleInlinePdfSelect(e, selectedStudent, sem, type, null)} />
                                  </label>
                                  <button
                                    onClick={() => {
                                      setSelectedStudent(null);
                                      handleOpenAdmin({
                                        rollNo: selectedStudent.rollNo,
                                        name: selectedStudent.name,
                                        semester: sem,
                                        examType: type,
                                        studentPassword: selectedStudent.studentPassword
                                      } as any);
                                    }}
                                    className="flex-1 sm:flex-none text-sky-400 hover:text-sky-300 text-xs font-bold px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg transition-colors border border-sky-500/20 whitespace-nowrap"
                                  >
                                    + Add Details
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={res.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 relative group">
                              <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-2 xl:gap-0 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                  (res.examType || 'Regular') === 'Regular' ? 'bg-sky-900/40 text-sky-300 border-sky-700/50' : 'bg-purple-900/40 text-purple-300 border-purple-700/50'
                                }`}>
                                  {displayName}
                                </span>
                                
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <label className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/20 whitespace-nowrap">
                                    <Upload className="w-3 h-3" /> PDF
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleInlinePdfSelect(e, selectedStudent, sem, type, res.id || null)} />
                                  </label>
                                  <button
                                    onClick={() => {
                                      setSelectedStudent(null);
                                      handleOpenAdmin(res);
                                    }}
                                    className="text-sky-400 hover:text-sky-300 text-xs flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-1 rounded border border-sky-500/20 whitespace-nowrap"
                                  >
                                    Edit ✏️
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteResult(res.id as string, e)}
                                    className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded border border-rose-500/20 whitespace-nowrap"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                  <p className="text-slate-500 text-xs mb-0.5">Marks</p>
                                  <p className="font-medium text-slate-200">{res.totalMarks !== null ? `${res.totalMarks}/1000` : '—'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-0.5">SGPA</p>
                                  <p className="font-medium text-sky-300">{res.sgpa !== null ? res.sgpa.toFixed(2) : '—'}</p>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <p className="text-slate-500 text-xs mb-0.5">Status</p>
                                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium border ${
                                  res.clearStatus === 'Cleared'
                                    ? 'bg-green-900/30 text-green-400 border-green-800/50'
                                    : res.clearStatus === 'Partially Cleared'
                                    ? 'bg-amber-900/30 text-amber-400 border-amber-800/50'
                                    : 'bg-red-900/30 text-red-400 border-red-800/50'
                                }`}>
                                  {res.clearStatus}
                                </span>
                              </div>
                              
                              {res.carrySubjects && (
                                <div className="mb-3">
                                  <p className="text-slate-500 text-xs mb-0.5">Carry Papers</p>
                                  <p className="text-slate-300 text-sm leading-snug">{res.carrySubjects}</p>
                                </div>
                              )}

                              {res.pdfData && (
                                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700/50">
                                  <button
                                    onClick={(e) => openPdf(e, res.pdfData)}
                                    className="flex-1 py-2 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-lg transition-colors border border-sky-500/20 text-sm font-medium flex justify-center items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" /> View PDF
                                  </button>
                                  <button
                                    onClick={(e) => downloadPdf(e, res.pdfData, res.rollNo)}
                                    className="flex-1 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20 text-sm font-medium flex justify-center items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" /> Download
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[70] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-lg rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
                🔐 ADMIN PANEL
              </h2>
              <button
                onClick={() => {
                  setIsAdminOpen(false);
                  setIsAdminAuthenticated(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">📚 Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-slate-200 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={`Semester ${num}`}>Semester {num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">📝 Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-slate-200 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Compartment">Compartment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1 flex items-center justify-between">
                  <span>🎫 Roll Number *</span>
                  {rollNo && (
                    <span className="text-xs text-amber-300 font-mono">
                      College Roll: {getCollegeRollNo(rollNo)}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 01 or 89251001"
                  value={rollNo}
                  onChange={(e) => {
                    const newRoll = e.target.value;
                    setRollNo(newRoll);
                    if (!studentPassword) {
                      // auto suggest college roll no as password
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">👤 Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none"
                />
              </div>

              {/* Password Setting Option */}
              <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5">
                <label className="block text-sm font-medium text-amber-300 ml-1 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Student Profile Password / Passcode</span>
                </label>
                <input
                  type="text"
                  placeholder={rollNo ? `Default: ${rollNo} (or custom password)` : 'Default: Roll No (e.g. 89251001)'}
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-600 transition-all outline-none text-sm font-mono"
                />
                <p className="text-xs text-slate-400 ml-1">
                  💡 Agar khali chhodenge toh automatically unka Roll No (e.g. <strong>{rollNo || '89251001'}</strong>) default password ban jayega.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">📊 Marks /1000</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="0.01"
                    placeholder="0-1000"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">📈 SGPA</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Auto from marks"
                    value={sgpa}
                    onChange={(e) => setSgpa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">⚠️ Carry Paper</label>
                <textarea
                  rows={2}
                  placeholder="Mathematics, Physics, DBMS..."
                  value={carrySubjects}
                  onChange={(e) => setCarrySubjects(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">✅ Clear Status</label>
                <select
                  value={clearStatus}
                  onChange={(e) => setClearStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-slate-200 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="Cleared">✔️ Cleared</option>
                  <option value="Not Cleared">❌ Not Cleared</option>
                  <option value="Partially Cleared">🔄 Partially Cleared</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">📄 Result PDF (Optional, max 1.5MB)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 border border-slate-700 hover:border-sky-500 rounded-xl px-4 py-3 text-slate-400 hover:text-sky-400 transition-all cursor-pointer border-dashed"
                  >
                    {isUploading ? (
                      <span className="animate-pulse">Uploading...</span>
                    ) : pdfData ? (
                      <>
                        <FileText className="w-5 h-5 text-sky-400" />
                        <span className="text-sky-400">PDF Attached</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload PDF</span>
                      </>
                    )}
                  </label>
                  {pdfData && (
                    <button
                      type="button"
                      onClick={() => setPdfData('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-300 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editId ? 'Update Record & Password' : 'Save Record & Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
