import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Trash2, Plus, LogIn, FileText, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New Paper Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPaper, setCurrentPaper] = useState({ title: '', description: '', timeLimit: 30, questions: [] });

  const fetchPapers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'papers'));
    setPapers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchPapers();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError('Invalid credentials or you do not have admin access.');
    }
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (currentPaper.questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }
    try {
      await addDoc(collection(db, 'papers'), currentPaper);
      setCurrentPaper({ title: '', description: '', timeLimit: 30, questions: [] });
      setIsEditing(false);
      fetchPapers();
    } catch (err) {
      console.error('Error creating paper:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      await deleteDoc(doc(db, 'papers', id));
      fetchPapers();
    }
  };

  const addQuestion = () => {
    setCurrentPaper(prev => ({
      ...prev,
      questions: [...prev.questions, {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }]
    }));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl"></div>
        <Card className="relative shadow-2xl border-white/60 bg-white/90">
          <CardHeader title="Admin Secure Login" description="Sign in to manage the QA platform" />
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-5">
              {authError && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">{authError}</div>}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border-slate-200 shadow-sm px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50/50" placeholder="admin@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border-slate-200 shadow-sm px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50/50" placeholder="••••••••" />
              </div>
              <Button type="submit" size="lg" className="w-full mt-2"><LogIn className="w-5 h-5 mr-2" /> Authenticate</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Admin Operations</h1>
          <p className="text-slate-500 font-medium mt-1">Design and manage certification mock exams.</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'primary'} size="lg" className="shadow-lg">
          {isEditing ? 'Cancel Editor' : <><Plus className="w-5 h-5 mr-2" /> Create New Exam</>}
        </Button>
      </div>

      {isEditing ? (
        <Card className="border-t-4 border-t-indigo-500 shadow-2xl shadow-indigo-900/5">
          <CardHeader title="Exam Metadata" description="Configure the top-level details of the paper." />
          <CardContent>
            <form onSubmit={handleCreatePaper} className="space-y-8">
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100/60 shadow-inner">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Paper Title</label>
                  <input type="text" value={currentPaper.title} onChange={e => setCurrentPaper({...currentPaper, title: e.target.value})} required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" placeholder="e.g. ISTQB Foundation Module 1" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Time Limit (mins)</label>
                  <input type="number" value={currentPaper.timeLimit} onChange={e => setCurrentPaper({...currentPaper, timeLimit: Number(e.target.value)})} required min="1" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea value={currentPaper.description} onChange={e => setCurrentPaper({...currentPaper, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none" rows={2} placeholder="Explain what topics are covered..." />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <div className="flex justify-between items-center mb-6 px-2">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-500" /> Questions Array</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addQuestion} className="shadow-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add Question
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {currentPaper.questions.length === 0 && (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                      <p className="text-slate-500 font-medium text-lg">Empty paper. Start adding questions below.</p>
                      <Button type="button" variant="outline" onClick={addQuestion} className="mt-4">
                        Add First Question
                      </Button>
                    </div>
                  )}
                  
                  {currentPaper.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 md:p-8 border border-slate-200 rounded-3xl relative bg-white shadow-sm group hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                      <div className="absolute -left-4 -top-4 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center font-black text-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                        {qIndex + 1}
                      </div>

                      <Button type="button" variant="ghost" size="sm" className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 hover:bg-rose-100" onClick={() => {
                        const newQ = [...currentPaper.questions];
                        newQ.splice(qIndex, 1);
                        setCurrentPaper({...currentPaper, questions: newQ});
                      }}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      
                      <div className="mb-6 mt-2 ml-2">
                        <label className="block text-sm font-extrabold text-slate-900 mb-2 uppercase tracking-wide">Question Content</label>
                        <textarea placeholder="Type your question here..." value={q.questionText} onChange={e => {
                          const newQ = [...currentPaper.questions];
                          newQ[qIndex].questionText = e.target.value;
                          setCurrentPaper({...currentPaper, questions: newQ});
                        }} required className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-y text-lg text-slate-800 font-medium" rows={2} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ml-2">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl border-2 transition-all ${q.correctAnswerIndex === oIndex ? 'bg-emerald-50/70 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                            <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors">
                              <input type="radio" name={`correct-${qIndex}`} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600" checked={q.correctAnswerIndex === oIndex} onChange={() => {
                                const newQ = [...currentPaper.questions];
                                newQ[qIndex].correctAnswerIndex = oIndex;
                                setCurrentPaper({...currentPaper, questions: newQ});
                              }} />
                            </label>
                            <input type="text" value={opt} placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} onChange={e => {
                              const newQ = [...currentPaper.questions];
                              newQ[qIndex].options[oIndex] = e.target.value;
                              setCurrentPaper({...currentPaper, questions: newQ});
                            }} required className="flex-1 py-2 px-1 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-medium" />
                          </div>
                        ))}
                      </div>
                      
                      <div className="ml-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <label className="block text-sm font-bold text-indigo-900 mb-2">Explanation for Learning Mode</label>
                        <textarea placeholder="Explain why the answer is correct to help students learn..." value={q.explanation} onChange={e => {
                          const newQ = [...currentPaper.questions];
                          newQ[qIndex].explanation = e.target.value;
                          setCurrentPaper({...currentPaper, questions: newQ});
                        }} className="w-full p-3 border border-indigo-200/60 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm" rows={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-8 mt-8 border-t border-slate-200">
                <Button type="submit" size="lg" className="w-full md:w-auto px-12 shadow-xl shadow-indigo-500/30 text-lg">
                  Deploy Exam Database
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center"><div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
          ) : papers.map(paper => (
            <Card key={paper.id} className="group hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border-slate-200 flex flex-col h-full bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-0 opacity-50"></div>
              <CardHeader 
                title={<span className="text-xl font-extrabold group-hover:text-indigo-600 transition-colors">{paper.title}</span>} 
                description={
                  <span className="flex items-center gap-2 mt-2 text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{paper.questions?.length} Qs</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{paper.timeLimit} Mins</span>
                  </span>
                } 
              />
              <CardContent className="flex-1 relative z-10 pt-2">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{paper.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center py-4 bg-slate-50/80 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 font-mono tracking-widest">{paper.id.slice(0, 8).toUpperCase()}</span>
                <Button variant="danger" size="sm" onClick={() => handleDelete(paper.id)} className="shadow-sm">
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          {!loading && papers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-300 shadow-sm">
              <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-700">No Exams Constructed</h3>
              <p className="text-slate-500 mt-2 text-lg">Click 'Create New Exam' to start building your platform.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
