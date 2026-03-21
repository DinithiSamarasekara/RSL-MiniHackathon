import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Trash2, Plus, LogIn } from 'lucide-react';

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
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader title="Admin Login" description="Sign in to manage exam papers" />
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{authError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <Button type="submit" className="w-full"><LogIn className="w-4 h-4 mr-2" /> Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Admin Dashboard</h1>
          <p className="text-gray-500">Manage exam papers and questions.</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'primary'}>
          {isEditing ? 'Cancel Editor' : <><Plus className="w-4 h-4 mr-1" /> Create New Paper</>}
        </Button>
      </div>

      {isEditing ? (
        <Card className="border-t-4 border-t-indigo-500">
          <CardHeader title="Create a New Exam Paper" />
          <CardContent>
            <form onSubmit={handleCreatePaper} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" value={currentPaper.title} onChange={e => setCurrentPaper({...currentPaper, title: e.target.value})} required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. ISTQB Foundation Level Mock Exam 1" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time Limit (mins)</label>
                  <input type="number" value={currentPaper.timeLimit} onChange={e => setCurrentPaper({...currentPaper, timeLimit: Number(e.target.value)})} required min="1" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={currentPaper.description} onChange={e => setCurrentPaper({...currentPaper, description: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500" rows={2} placeholder="Brief description of the paper..." />
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-1" /> Add Question
                  </Button>
                </div>
                
                {currentPaper.questions.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No questions added yet. Click 'Add Question' to start.</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {currentPaper.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-5 border rounded-xl relative bg-gray-50/50 shadow-sm group">
                      <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                        const newQ = [...currentPaper.questions];
                        newQ.splice(qIndex, 1);
                        setCurrentPaper({...currentPaper, questions: newQ});
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-indigo-900 mb-2">Question {qIndex + 1}</label>
                        <textarea placeholder="Enter question text here..." value={q.questionText} onChange={e => {
                          const newQ = [...currentPaper.questions];
                          newQ[qIndex].questionText = e.target.value;
                          setCurrentPaper({...currentPaper, questions: newQ});
                        }} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" rows={2} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className={`flex items-center gap-3 p-2 rounded-lg border ${q.correctAnswerIndex === oIndex ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <input type="radio" name={`correct-${qIndex}`} className="w-4 h-4 text-green-600 ml-2" checked={q.correctAnswerIndex === oIndex} onChange={() => {
                              const newQ = [...currentPaper.questions];
                              newQ[qIndex].correctAnswerIndex = oIndex;
                              setCurrentPaper({...currentPaper, questions: newQ});
                            }} />
                            <input type="text" value={opt} placeholder={`Option ${oIndex + 1}`} onChange={e => {
                              const newQ = [...currentPaper.questions];
                              newQ[qIndex].options[oIndex] = e.target.value;
                              setCurrentPaper({...currentPaper, questions: newQ});
                            }} required className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm" />
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                        <textarea placeholder="Explain why the answer is correct..." value={q.explanation} onChange={e => {
                          const newQ = [...currentPaper.questions];
                          newQ[qIndex].explanation = e.target.value;
                          setCurrentPaper({...currentPaper, questions: newQ});
                        }} className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500" rows={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" size="lg" className="w-full md:w-auto px-8">Save Output Paper</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : papers.map(paper => (
            <Card key={paper.id} className="hover:shadow-md transition-shadow">
              <CardHeader title={paper.title} description={`${paper.questions?.length || 0} questions • ${paper.timeLimit} mins`} />
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{paper.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center py-3">
                <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full text-gray-600">{paper.id.slice(0, 6)}</span>
                <Button variant="danger" size="sm" onClick={() => handleDelete(paper.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          {!loading && papers.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg dashed border-2 border-gray-300">
              No papers created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
