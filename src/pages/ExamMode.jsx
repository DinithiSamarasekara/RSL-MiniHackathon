import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button } from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import Timer from '../components/Timer';
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function ExamMode() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    async function loadPaper() {
      try {
        const docRef = doc(db, 'papers', paperId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
          setPaper({ id: docSnap.id, ...data, questions: shuffled });
        } else {
          alert('Paper not found!');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPaper();
  }, [paperId, navigate]);

  const handleSubmit = () => {
    navigate('/result', { state: { paper, answers } });
  };

  const handleSelect = (idx) => {
    setAnswers({ ...answers, [currentQIndex]: idx });
  };

  const nextQuestion = () => {
    if (currentQIndex < paper.questions.length - 1) setCurrentQIndex(currentQIndex + 1);
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
  if (!paper) return null;

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 mt-8 animate-fade-in relative">
        <div className="absolute -inset-4 bg-gradient-to-b from-blue-50 to-transparent blur-3xl -z-10 rounded-full opacity-50"></div>
        
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg border border-slate-100 mb-8">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">{paper.title}</h1>
        <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">{paper.description}</p>
        
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl mb-12 border border-white shadow-xl shadow-slate-200/50 text-left">
          <h3 className="font-black text-2xl mb-6 text-slate-800 tracking-tight">Exam Protocol & Rules:</h3>
          <ul className="space-y-4 text-base text-slate-700 font-medium">
            <li className="flex gap-3"><span className="text-indigo-500 font-bold">•</span> <div>Strict Time Limit: <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{paper.timeLimit} Minutes</strong>. The timer will remain visible.</div></li>
            <li className="flex gap-3"><span className="text-indigo-500 font-bold">•</span> <div>Total Questions: <strong>{paper.questions.length}</strong> expertly drafted scenarios.</div></li>
            <li className="flex gap-3"><span className="text-indigo-500 font-bold">•</span> <div>Auto-Submit: When the timer ends, your exam is submitted instantly. No exceptions.</div></li>
            <li className="flex gap-3"><span className="text-indigo-500 font-bold">•</span> <div>Navigation is allowed. Unanswered questions do not deduct points.</div></li>
            <li className="flex gap-3"><span className="text-rose-500 font-bold">•</span> <div className="text-rose-600"><strong>Do not refresh the page.</strong> Your progress is local and will be lost forever.</div></li>
          </ul>
        </div>
        
        <Button size="lg" className="w-full text-xl shadow-2xl font-black h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] transform transition-all active:scale-[0.98]" onClick={() => setExamStarted(true)}>
          Acknowledge & Start Exam
        </Button>
      </div>
    );
  }

  const currentQ = paper.questions[currentQIndex];
  const selectedAnswer = answers[currentQIndex];
  const attemptedCount = Object.keys(answers).length;
  const progressPercentage = (attemptedCount / paper.questions.length) * 100;

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-fade-in relative z-10">
      {/* Dynamic Progress Bar top edge */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-200">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{width: `${progressPercentage}%`}}></div>
      </div>

      <div className="sticky top-[64px] sm:top-[80px] z-40 bg-white/85 backdrop-blur-2xl py-4 -mx-4 px-4 sm:mx-0 sm:px-6 border border-slate-200 sm:rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
        <div className="flex-1 w-full text-center sm:text-left">
          <h2 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight truncate">{paper.title}</h2>
          <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
            Attempted: <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{attemptedCount} / {paper.questions.length}</span>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
          <div className="scale-110 origin-right"><Timer initialMinutes={paper.timeLimit} onTimeUp={handleSubmit} /></div>
          <Button variant="danger" size="lg" className="shadow-lg shadow-rose-500/20 font-bold tracking-wide" onClick={() => {
            if(confirm('Are you absolutely sure you want to finalize and submit the exam early?')) handleSubmit();
          }}>
            Submit Final
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          <Card className="shadow-xl shadow-slate-200/50 border-0 ring-1 ring-slate-200 rounded-3xl overflow-visible relative bg-white/95">
            <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center font-black text-2xl transform -rotate-6 border-4 border-white z-10">
              {currentQIndex + 1}
            </div>
            
            <CardContent className="p-8 sm:p-12 sm:pt-14 relative z-0">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-snug tracking-tight mb-10 pl-4">{currentQ.questionText}</h3>
              
              <div className="space-y-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 transform outline-none ${
                      selectedAnswer === idx 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-4 ring-indigo-500/10 scale-[1.01] z-10 relative' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedAnswer === idx ? 'border-indigo-500 bg-white shadow-inner' : 'border-slate-300 bg-slate-50'}`}>
                        {selectedAnswer === idx && <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-sm"></div>}
                      </div>
                      <span className={`text-lg sm:text-xl leading-tight ${selectedAnswer === idx ? 'text-indigo-950 font-bold' : 'text-slate-700 font-medium'}`}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center bg-slate-50/80 p-6 sm:px-12 rounded-b-3xl border-t border-slate-100">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQIndex === 0} className="w-32 py-5 bg-white border-slate-300 shadow-sm hover:border-slate-400">
                <ArrowLeft className="w-5 h-5 mr-2" /> Prev
              </Button>
              <div className="hidden sm:block text-xs font-black text-slate-300 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                Progress: {currentQIndex + 1} / {paper.questions.length}
              </div>
              <Button variant="primary" onClick={nextQuestion} disabled={currentQIndex === paper.questions.length - 1} className="w-32 py-5 shadow-lg shadow-indigo-500/20">
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="xl:col-span-1 border-t xl:border-t-0 pt-8 xl:pt-0">
          <div className="sticky top-[180px] bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200 ring-1 ring-white">
            <h4 className="font-extrabold text-slate-800 mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Exam Map
            </h4>
            
            <div className="grid grid-cols-5 xl:grid-cols-4 gap-3">
              {paper.questions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentQIndex === idx;
                let btnClass = "w-full aspect-square rounded-xl font-bold text-sm flex items-center justify-center border-2 transition-all duration-300 ";
                
                if (isCurrent) btnClass += "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 transform scale-110 z-10 ";
                else if (isAnswered) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm ";
                else btnClass += "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 ";

                return (
                  <button key={idx} onClick={() => setCurrentQIndex(idx)} className={btnClass}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-indigo-600 rounded shadow-sm"></div> Current Active</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-500 rounded shadow-sm"></div> Answered</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-white border-2 border-slate-200 rounded shadow-sm"></div> Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
