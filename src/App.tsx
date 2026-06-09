/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
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
import { Search, Plus, Save, Trash2, X, GraduationCap, XCircle } from 'lucide-react';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

interface Result {
  id?: string;
  rollNo: string;
  name: string;
  totalMarks: number | null;
  sgpa: number | null;
  carrySubjects: string;
  clearStatus: string;
  createdAt?: any;
}

export default function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingEditRec, setPendingEditRec] = useState<Result | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [totalMarks, setTotalMarks] = useState<string>('');
  const [sgpa, setSgpa] = useState<string>('');
  const [carrySubjects, setCarrySubjects] = useState('');
  const [clearStatus, setClearStatus] = useState('Cleared');

  useEffect(() => {
    const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
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
    // If it's a mouse event, ignore it as rec
    if (rec && !('nativeEvent' in rec)) {
      setPendingEditRec(rec);
    } else {
      setPendingEditRec(null);
    }
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'golu@12') {
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      setPasswordError('');
      if (pendingEditRec) {
        setEditId(pendingEditRec.id!);
        setRollNo(pendingEditRec.rollNo);
        setStudentName(pendingEditRec.name);
        setTotalMarks(pendingEditRec.totalMarks !== null ? pendingEditRec.totalMarks.toString() : '');
        setSgpa(pendingEditRec.sgpa !== null ? pendingEditRec.sgpa.toString() : '');
        setCarrySubjects(pendingEditRec.carrySubjects || '');
        setClearStatus(pendingEditRec.clearStatus);
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

    const tMarks = totalMarks ? parseFloat(totalMarks) : null;
    let sMarks = sgpa ? parseFloat(sgpa) : null;

    if (tMarks !== null && sMarks === null) {
      sMarks = tMarks / 100;
      sMarks = Math.round(sMarks * 100) / 100;
    }

    const record = {
      rollNo,
      name: studentName,
      totalMarks: tMarks,
      sgpa: sMarks,
      carrySubjects,
      clearStatus,
    };

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
    setTotalMarks('');
    setSgpa('');
    setCarrySubjects('');
    setClearStatus('Cleared');
  };

  const loadSampleData = async () => {
    const samples = [
      { rollNo: 'CS24001', name: 'Arjun Reddy', totalMarks: 820, sgpa: 8.2, carrySubjects: 'Data Structures', clearStatus: 'Cleared' },
      { rollNo: 'CS24002', name: 'Meera Nair', totalMarks: 450, sgpa: 4.5, carrySubjects: 'Mathematics, Physics', clearStatus: 'Not Cleared' },
      { rollNo: 'EC2456', name: 'Rohan Das', totalMarks: 680, sgpa: 6.8, carrySubjects: '', clearStatus: 'Cleared' },
      { rollNo: 'IT20099', name: 'Sneha Sharma', totalMarks: 910, sgpa: 9.1, carrySubjects: '', clearStatus: 'Cleared' },
      { rollNo: 'ME2098', name: 'Kunal Verma', totalMarks: 380, sgpa: 3.8, carrySubjects: 'Thermodynamics', clearStatus: 'Partially Cleared' },
    ];
    for (const sample of samples) {
      await addDoc(collection(db, 'results'), {
        ...sample,
        createdAt: serverTimestamp(),
      });
    }
    handleAdminAlert('✅ Sample data added!', false);
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

  const filteredResults = results.filter((item) => {
    const s = searchTerm.toLowerCase();
    return (
      item.rollNo.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s) ||
      item.carrySubjects.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] to-[#0f172f] text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
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
            📊 Total: {results.length}
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-slate-900/85 border border-sky-400/25 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-semibold border-l-4 border-sky-400 pl-4 mb-6 flex items-center gap-2">
            📋 Student Results (Firebase)
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by Roll No, Name, Subject..."
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

          <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-800/80 text-sky-200 border-b border-slate-700">
                  <th className="p-4 font-semibold w-24">Roll No</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold w-32">Marks</th>
                  <th className="p-4 font-semibold w-20">SGPA</th>
                  <th className="p-4 font-semibold">Carry Paper</th>
                  <th className="p-4 font-semibold w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sky-400/80 animate-pulse">
                      🔄 Loading data from Firebase...
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      📭 No records found
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-sky-500/5 transition-colors cursor-pointer group"
                      onClick={() => handleOpenAdmin(rec)}
                    >
                      <td className="p-4">
                        <strong className="text-yellow-400 group-hover:text-yellow-300 transition-colors">
                          {rec.rollNo}
                        </strong>
                      </td>
                      <td className="p-4 font-medium text-amber-200/90">{rec.name}</td>
                      <td className="p-4 text-slate-300">
                        {rec.totalMarks !== null ? `${rec.totalMarks} / 1000` : '—'}
                      </td>
                      <td className="p-4">
                        <span className="bg-[#0f3b4c] text-sky-300 px-3 py-1 rounded-full text-sm font-medium border border-sky-400/20">
                          {rec.sgpa !== null ? rec.sgpa.toFixed(2) : '—'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {rec.carrySubjects ? rec.carrySubjects : '—'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${
                            rec.clearStatus === 'Cleared'
                              ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                              : rec.clearStatus === 'Partially Cleared'
                              ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
                              : 'bg-red-900/50 text-red-300 border border-red-700/50'
                          }`}
                        >
                          {rec.clearStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6 text-xs text-slate-500 font-mono tracking-wide">
            🔐 DOUBLE-TAP on "Result Manager" heading to open ADMIN PANEL
          </div>
          <div className="text-center mt-2 text-xs text-slate-500 tracking-wide">
            ✅ Data stored in Firebase Firestore | Access from any device
          </div>
        </main>
      </div>

      {/* Password Modal Overlay */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

            {(errorMsg || successMsg) && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium ${
                  errorMsg ? 'bg-rose-950/50 border border-rose-800 text-rose-300' : 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                }`}
              >
                 {errorMsg ? <XCircle className="w-5 h-5 shrink-0" /> : <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</div>}
                 {errorMsg || successMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
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
                    onClick={loadSampleData}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={deleteAllRecords}
                    className="bg-rose-950 hover:bg-rose-900 border border-rose-900/50 text-rose-400 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
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

