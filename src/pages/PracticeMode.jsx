import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button } from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export default function PracticeMode() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    async function loadPaper() {
      try {
        const docRef = doc(db, 'papers', paperId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaper({ id: docSnap.id, ...docSnap.data() });
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

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!paper || !paper.questions || paper.questions.length === 0) return <div className="text-center text-xl font-bold mt-20 text-slate-500">No questions found!</div>;

  const currentQ = paper.questions[currentQIndex];
  const selectedAnswer = answers[currentQIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === currentQ.correctAnswerIndex;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setAnswers({ ...answers, [currentQIndex]: idx });
  };

  const nextQuestion = () => {
    if (currentQIndex < paper.questions.length - 1) setCurrentQIndex(currentQIndex + 1);
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  const score = Object.keys(answers).reduce((acc, qIdx) => {
    return acc + (answers[qIdx] === paper.questions[qIdx].correctAnswerIndex ? 1 : 0);
  }, 0);

  const progressPercentage = ((currentQIndex + 1) / paper.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-200/50">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Practice Mode</span>
            <span className="block text-base font-extrabold text-slate-800 tracking-tight">{paper.title}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Question</span>
          <span className="block text-base font-extrabold text-indigo-600">{currentQIndex + 1} <span className="text-slate-400">/ {paper.questions.length}</span></span>
        </div>
      </div>

      <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300/30">
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out relative" style={{ width: `${progressPercentage}%` }}>
          <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-sm"></div>
        </div>
      </div>

      <Card className="shadow-2xl shadow-indigo-900/5 overflow-visible mt-12 bg-white/95 border-0 ring-1 ring-slate-200">
        <div className="absolute -top-6 left-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex justify-center items-center shadow-lg transform -rotate-6 shadow-indigo-500/30 font-black text-xl border-2 border-white">
          <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-300 animate-pulse" />
          {currentQIndex + 1}
        </div>
        
        <CardContent className="pt-12 pb-8 px-8 sm:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 leading-snug tracking-tight">{currentQ.questionText}</h2>
          
          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full justify-start text-left py-4 px-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ";
              
              if (!isAnswered) {
                btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-md bg-white text-slate-700 font-medium";
              } else {
                if (idx === currentQ.correctAnswerIndex) {
                  btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm ring-2 ring-emerald-500/20 z-10 scale-[1.02]";
                } else if (idx === selectedAnswer && !isCorrect) {
                  btnClass += "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                } else {
                  btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={isAnswered} className={btnClass}>
                  {!isAnswered && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                  <div className="flex items-center justify-between w-full relative z-10">
                    <span className="text-lg leading-tight">{opt}</span>
                    {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 animate-bounce" />}
                    {isAnswered && idx === selectedAnswer && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className={`mt-10 p-6 rounded-2xl border backdrop-blur-sm animate-fade-in shadow-inner ${isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-rose-50/80 border-rose-200 text-rose-900'}`}>
              <div className="flex items-center gap-3 font-black text-xl mb-3 uppercase tracking-wider">
                {isCorrect ? <><CheckCircle2 className="w-8 h-8" /> Brilliant!</> : <><XCircle className="w-8 h-8" /> Not quite.</>}
              </div>
              {!isCorrect && <p className="mb-4 text-base">The correct answer was: <strong className="font-bold underline decoration-rose-300 decoration-2 underline-offset-4">{currentQ.options[currentQ.correctAnswerIndex]}</strong></p>}
              
              {currentQ.explanation && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <span className="font-extrabold block mb-2 uppercase text-xs tracking-widest opacity-80">Explanation</span>
                  <div className="font-medium leading-relaxed">{currentQ.explanation}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center mt-2 px-8 py-6 bg-slate-50 border-t border-slate-100">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQIndex === 0} className="w-32 py-5 shadow-sm bg-white">
            <ArrowLeft className="w-5 h-5 mr-2" /> Previous
          </Button>
          
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Score</span>
            <div className="text-lg font-black text-slate-800 bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200">
              <span className="text-indigo-600">{score}</span> / {Object.keys(answers).length}
            </div>
          </div>

          {currentQIndex < paper.questions.length - 1 ? (
            <Button onClick={nextQuestion} variant={isAnswered ? 'primary' : 'secondary'} className={`w-32 py-5 shadow-md ${isAnswered ? 'animate-pulse' : ''}`}>
              Next <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/')} variant="primary" className="py-5 shadow-xl shadow-blue-500/30">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Finish
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
