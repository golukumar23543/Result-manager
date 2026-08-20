import { useState, useEffect, FormEvent, useMemo } from 'react';
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
import { Search, Plus, Save, Trash2, X, GraduationCap, XCircle, FileText, Upload, Download, User, BookOpen } from 'lucide-react';

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
  createdAt?: any;
}

interface StudentGroup {
  rollNo: string;
  name: string;
  profileImage?: string;
  results: Result[];
}

export default function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingEditRec, setPendingEditRec] = useState<Result | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentGroup | null>(null);
  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
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
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Result);
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
    }, 3000);
  };

  const handleOpenAdmin = (rec?: Result | React.MouseEvent | React.SyntheticEvent) => {
    if (rec && !('nativeEvent' in rec)) {
      setPendingEditRec(rec as Result);
    } else {
      setPendingEditRec(null);
    }
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'golu@12') {
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      setPasswordError('');
      
      if (pendingProfileImage && selectedStudent) {
        try {
          const updates = selectedStudent.results.map(r =>
            updateDoc(doc(db, 'results', r.id!), { profileImage: pendingProfileImage })
          );
          await Promise.all(updates);
          setSelectedStudent(prev => prev ? { ...prev, profileImage: pendingProfileImage } : prev);
          setPendingProfileImage(null);
          handleAdminAlert('✅ Profile photo updated!', false);
        } catch (err) {
          console.error(err);
          handleAdminAlert('❌ Failed to update photo', true);
          setPendingProfileImage(null);
        }
        return;
      }

      resetForm();
      if (pendingEditRec) {
        if (pendingEditRec.id) setEditId(pendingEditRec.id);
        if (pendingEditRec.rollNo) setRollNo(pendingEditRec.rollNo);
        if (pendingEditRec.name) setStudentName(pendingEditRec.name);
        if (pendingEditRec.semester) setSemester(pendingEditRec.semester);
        if (pendingEditRec.examType) setExamType(pendingEditRec.examType);
        if (pendingEditRec.totalMarks !== undefined && pendingEditRec.totalMarks !== null) setTotalMarks(pendingEditRec.totalMarks.toString());
        if (pendingEditRec.sgpa !== undefined && pendingEditRec.sgpa !== null) setSgpa(pendingEditRec.sgpa.toString());
        if (pendingEditRec.carrySubjects) setCarrySubjects(pendingEditRec.carrySubjects);
        if (pendingEditRec.clearStatus) setClearStatus(pendingEditRec.clearStatus);
        if (pendingEditRec.pdfData) setPdfData(pendingEditRec.pdfData);
      }
      setIsAdminOpen(true);
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !studentName.trim()) {
      handleAdminAlert('Roll No and Name are required!', true);
      return;
    }

    let formattedRollNo = rollNo.trim();
    if (!formattedRollNo.startsWith('892510')) {
      let suffix = formattedRollNo;
      if (suffix.length === 1 && !isNaN(Number(suffix))) {
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

    const record: any = {
      rollNo: formattedRollNo,
      name: studentName,
      semester,
      examType,
      totalMarks: tMarks,
      sgpa: sMarks,
      carrySubjects,
      clearStatus,
    };
    
    if (pdfData) {
      record.pdfData = pdfData;
    } else {
      record.pdfData = '';
    }

    try {
      if (editId) {
        await updateDoc(doc(db, 'results', editId), record);
        handleAdminAlert('✅ Record updated!', false);
      } else {
        await addDoc(collection(db, 'results'), {
          ...record,
          createdAt: serverTimestamp(),
        });
        handleAdminAlert('✅ Record added!', false);
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
    setSemester('Semester 1');
    setExamType('Regular');
    setTotalMarks('');
    setSgpa('');
    setCarrySubjects('');
    setClearStatus('Cleared');
    setPdfData('');
  };

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      handleAdminAlert('File size must be under 2.5MB', true);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingProfileImage(event.target?.result as string);
      setIsPasswordModalOpen(true);
    };
    reader.onerror = () => {
      handleAdminAlert('Failed to read image file', true);
    }
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset to allow re-selection
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const downloadPdf = (e: React.MouseEvent, base64Data?: string, rollNo?: string) => {
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
      a.download = `Result_${rollNo || 'document'}.pdf`;
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
      a.download = `Result_${rollNo || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const openPdf = (e: React.MouseEvent, base64Data?: string) => {
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

  const deleteAllRecords = async () => {
    if (!confirm('⚠️ DELETE ALL RECORDS? This cannot be undone!')) return;
    try {
      const snapshot = await getDocs(collection(db, 'results'));
      snapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'results', document.id));
      });
      handleAdminAlert('✅ All records deleted!', false);
    } catch (err) {
      handleAdminAlert('❌ Failed to delete!', true);
    }
  };

  const groupedStudents = useMemo(() => {
    const groups = new Map<string, StudentGroup>();
    results.forEach(r => {
      const s = searchTerm.toLowerCase();
      const matches = r.rollNo.toLowerCase().includes(s) || r.name.toLowerCase().includes(s);
      if (!matches && searchTerm) return;

      if (!groups.has(r.rollNo)) {
        groups.set(r.rollNo, { rollNo: r.rollNo, name: r.name, results: [], profileImage: r.profileImage });
      } else if (r.profileImage && !groups.get(r.rollNo)!.profileImage) {
        groups.get(r.rollNo)!.profileImage = r.profileImage;
      }
      groups.get(r.rollNo)!.results.push(r);
    });
    return Array.from(groups.values());
  }, [results, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] to-[#0f172f] text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-sky-400/30 shadow-xl backdrop-blur-sm">
          <div className="space-y-1 text-center md:text-left">
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent cursor-pointer select-none flex items-center justify-center md:justify-start gap-2"
              onDoubleClick={handleOpenAdmin as any}
            >
              <GraduationCap className="text-sky-400 w-8 h-8" />
              Result Manager
            </h1>
            <p className="text-slate-400 text-sm">Firebase Database | Permanent Storage | Real-time</p>
          </div>
          <div className="bg-slate-800 border border-sky-400 text-sky-400 px-5 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            👥 Students: {groupedStudents.length}
          </div>
        </header>

        <main className="bg-slate-900/85 border border-sky-400/25 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-semibold border-l-4 border-sky-400 pl-4 mb-6 flex items-center gap-2">
            📋 Student Profiles
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Roll No or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-600"
              />
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-3 rounded-2xl transition-colors font-medium whitespace-nowrap"
            >
              Clear
            </button>
            <button
               onClick={handleOpenAdmin as any}
               className="bg-sky-500 hover:bg-sky-400 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-colors whitespace-nowrap shadow-lg shadow-sky-500/20"
            >
              Open Admin
            </button>
          </div>

          <div className="overflow-hidden md:overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-left border-collapse block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-slate-800/80 text-sky-200 border-b border-slate-700">
                  <th className="p-4 font-semibold w-32">Roll No</th>
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold w-40">Total Records</th>
                  <th className="p-4 font-semibold w-32 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 block md:table-row-group">
                {isLoading ? (
                  <tr className="block md:table-row">
                    <td colSpan={4} className="p-8 text-center text-sky-400/80 animate-pulse block md:table-cell">
                      🔄 Loading data from Firebase...
                    </td>
                  </tr>
                ) : groupedStudents.length === 0 ? (
                  <tr className="block md:table-row">
                    <td colSpan={4} className="p-8 text-center text-slate-500 block md:table-cell">
                      📭 No students found
                    </td>
                  </tr>
                ) : (
                  groupedStudents.map((student) => (
                    <tr
                      key={student.rollNo}
                      className="block md:table-row hover:bg-sky-500/5 transition-colors cursor-pointer group p-4 md:p-0"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="block md:table-cell p-2 md:p-4 border-b border-slate-800/50 md:border-none flex items-center md:table-cell">
                        <span className="inline-block md:hidden text-slate-400 w-28 text-sm font-medium">Roll No:</span>
                        <strong className="text-yellow-400 group-hover:text-yellow-300 transition-colors">
                          {student.rollNo}
                        </strong>
                      </td>
                      <td className="block md:table-cell p-2 md:p-4 font-medium text-amber-200/90 flex items-center gap-3 border-b border-slate-800/50 md:border-none">
                        <span className="inline-block md:hidden text-slate-400 w-28 text-sm font-medium">Name:</span>
                        {student.profileImage ? (
                          <img src={student.profileImage} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700/50 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50 shrink-0">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                        {student.name}
                      </td>
                      <td className="block md:table-cell p-2 md:p-4 text-slate-300 border-b border-slate-800/50 md:border-none flex items-center md:table-cell">
                        <span className="inline-block md:hidden text-slate-400 w-28 text-sm font-medium">Records:</span>
                        <span className="bg-[#0f3b4c] text-sky-300 px-3 py-1 rounded-full text-sm font-medium border border-sky-400/20">
                          {student.results.length} Results
                        </span>
                      </td>
                      <td className="block md:table-cell p-2 md:p-4 text-right border-b border-slate-800/50 md:border-none">
                         <span className="text-sky-400 text-sm font-semibold group-hover:underline">View Profile &rarr;</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Global Alerts */}
      {(errorMsg || successMsg) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
          <div
            className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 ${
              errorMsg ? 'bg-rose-950/90 border-rose-800/80 text-rose-200' : 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200'
            }`}
          >
             {errorMsg ? <XCircle className="w-6 h-6 shrink-0 text-rose-400" /> : <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</div>}
             {errorMsg || successMsg}
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-4xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {selectedStudent.profileImage ? (
                    <img src={selectedStudent.profileImage} alt={selectedStudent.name} className="w-14 h-14 rounded-2xl object-cover border border-sky-500/50 shadow-lg" />
                  ) : (
                    <div className="bg-sky-500/20 p-3 rounded-2xl border border-sky-500/30 w-14 h-14 flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-sky-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm border border-sky-400/50">
                    <Upload className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageSelect} />
                  </label>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedStudent.name}</h2>
                  <p className="text-sky-400 font-mono mt-1">{selectedStudent.rollNo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800 bg-slate-800/50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 pb-4 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(sem => {
                  const semResults = selectedStudent.results.filter(r => (r.semester || 'Semester 1') === sem);
                  
                  return (
                    <div key={sem} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-bold text-lg text-indigo-100">{sem}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {['Regular', 'Compartment'].map(type => {
                          const res = semResults.find(r => (r.examType || 'Regular') === type);
                          
                          if (!res) {
                            return (
                              <div key={type} className="border border-dashed border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/20">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${type === 'Regular' ? 'bg-sky-500/50' : 'bg-purple-500/50'}`}></span>
                                  <span className="text-slate-500 text-sm font-medium">{type} Result Pending</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedStudent(null);
                                    handleOpenAdmin({ rollNo: selectedStudent.rollNo, name: selectedStudent.name, semester: sem, examType: type } as any);
                                  }}
                                  className="text-sky-400 hover:text-sky-300 text-xs font-bold px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                                >
                                  + Add {type}
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div key={res.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 relative group">
                              <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                  (res.examType || 'Regular') === 'Regular' ? 'bg-sky-900/40 text-sky-300 border-sky-700/50' : 'bg-purple-900/40 text-purple-300 border-purple-700/50'
                                }`}>
                                  {res.examType || 'Regular'}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setSelectedStudent(null);
                                    handleOpenAdmin(res);
                                  }}
                                  className="text-slate-500 hover:text-sky-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Edit ✏️
                                </button>
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
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
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

      {/* Password Modal Overlay */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2">
                🔒 Admin Access
              </h2>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordInput('');
                  setPasswordError('');
                  setPendingProfileImage(null);
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 placeholder:text-slate-600 transition-all outline-none"
                />
                {passwordError && (
                  <p className="text-rose-400 text-sm mt-2 ml-1">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
                🔐 ADMIN PANEL
              </h2>
              <button
                onClick={() => {
                  setIsAdminOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">🎫 Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CS24001"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
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

              <div className="grid grid-cols-2 gap-4">
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
                    max="10"
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

              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editId ? 'Update Record' : 'Save Record'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={deleteAllRecords}
                    className="col-span-2 bg-rose-950 hover:bg-rose-900 border border-rose-900/50 text-rose-400 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete All
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
