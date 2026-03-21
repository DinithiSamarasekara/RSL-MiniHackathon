import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { CheckCircle2, XCircle, BarChart3, HelpCircle, ArrowLeft, Trophy, AlertTriangle } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.paper) {
    return <Navigate to="/" replace />;
  }

  const { paper, answers } = state;
  const totalQuestions = paper.questions.length;
  
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  paper.questions.forEach((q, idx) => {
    const selected = answers[idx];
    if (selected === undefined) {
      unattemptedCount++;
    } else if (selected === q.correctAnswerIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 65; // standard ISTQB passing score

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 animate-fade-in relative z-10">
      {/* Confetti Background overlay if passed */}
      {isPassed && <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top_center,_var(--color-brand-100),_transparent_70%)] -z-10"></div>}
      
      <div className="text-center mb-16 pt-8">
        <div className="inline-block p-4 bg-white/50 backdrop-blur-sm shadow-sm rounded-full border border-white mb-6">
          {isPassed ? <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-md" /> : <AlertTriangle className="w-16 h-16 text-rose-500 drop-shadow-md" />}
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight drop-shadow-sm">Exam Summary</h1>
        <p className="text-2xl text-slate-600 font-medium">{paper.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className={`text-center border-t-8 shadow-2xl overflow-hidden relative ${isPassed ? 'border-t-emerald-500 shadow-emerald-900/10' : 'border-t-rose-500 shadow-rose-900/10'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 opacity-50"></div>
          <CardContent className="pt-12 pb-10 flex flex-col items-center justify-center min-h-[250px]">
            <div className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Overall Score</div>
            <div className={`text-7xl font-black mb-4 tracking-tighter ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
              {scorePercentage}%
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase ${isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isPassed ? 'PASS' : 'FAIL'}
            </div>
            {isPassed && <p className="text-slate-500 font-medium text-sm mt-4">Congratulations, you met the passing threshold!</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-xl border border-slate-200">
          <CardHeader title={<span className="text-2xl font-extrabold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-indigo-500" /> Performance Breakdown</span>} />
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-slate-100 h-full min-h-[200px] bg-slate-50/50">
              <div className="p-8 flex flex-col justify-center items-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-5xl font-black text-slate-800 mb-2">{correctCount}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Correct</div>
              </div>
              <div className="p-8 flex flex-col justify-center items-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <XCircle className="w-8 h-8 text-rose-600" />
                </div>
                <div className="text-5xl font-black text-slate-800 mb-2">{incorrectCount}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Incorrect</div>
              </div>
              <div className="p-8 flex flex-col justify-center items-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-slate-600 font-bold text-2xl">
                  {unattemptedCount}
                </div>
                <div className="text-5xl font-black text-slate-400 mb-2">{unattemptedCount}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unanswered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-slate-300 flex-1"></div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
            Comprehensive Review
          </h2>
          <div className="h-px bg-slate-300 flex-1"></div>
        </div>
        
        <div className="space-y-8">
          {paper.questions.map((q, idx) => {
            const selected = answers[idx];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctAnswerIndex;

            return (
              <Card key={idx} className={`shadow-md border-0 ring-1 overflow-hidden transition-all hover:shadow-lg ${!isAnswered ? 'ring-slate-300' : isCorrect ? 'ring-emerald-300 shadow-emerald-900/5' : 'ring-rose-300 shadow-rose-900/5'}`}>
                <div className={`px-6 py-5 border-b flex gap-4 items-start ${!isAnswered ? 'bg-slate-50 border-slate-200' : isCorrect ? 'bg-emerald-50/50 border-emerald-200/50' : 'bg-rose-50/50 border-rose-200/50'}`}>
                  <div className={`mt-0.5 flex-shrink-0 bg-white rounded-full p-1 shadow-sm ${!isAnswered ? 'text-slate-400 border border-slate-200' : isCorrect ? 'text-emerald-500 border border-emerald-200' : 'text-rose-500 border border-rose-200'}`}>
                    {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      <span className="text-slate-400 mr-2 font-mono text-lg">#{idx + 1}</span> {q.questionText}
                    </h3>
                  </div>
                </div>
                
                <CardContent className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "p-5 rounded-2xl border-2 transition-all flex items-center justify-between text-lg ";
                      
                      if (oIdx === q.correctAnswerIndex) {
                        btnClass += "border-emerald-500 bg-emerald-50 font-bold text-emerald-950 shadow-sm ring-2 ring-emerald-500/20";
                      } else if (oIdx === selected && !isCorrect) {
                        btnClass += "border-rose-400 bg-rose-50 text-rose-900 shadow-sm";
                      } else {
                        btnClass += "border-slate-100 bg-white text-slate-500 opacity-70";
                      }

                      return (
                        <div key={oIdx} className={btnClass}>
                          <span>{opt}</span>
                          {oIdx === q.correctAnswerIndex && <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />}
                          {oIdx === selected && !isCorrect && <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {!isAnswered && (
                    <div className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 mb-4">
                      <AlertTriangle className="w-4 h-4 text-slate-400" /> Skip Warning: No answer provided.
                    </div>
                  )}

                  {q.explanation && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl p-6 md:p-8 border border-indigo-100 mt-4 shadow-inner">
                      <span className="font-black text-indigo-900 block mb-3 tracking-widest text-xs uppercase opacity-80 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Expert Explanation
                      </span>
                      <p className="text-indigo-950 leading-loose text-base md:text-lg font-medium">{q.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-12 pb-24 border-t mt-16 border-slate-200">
        <p className="text-slate-500 font-medium mb-6 text-lg">Ready for another challenge?</p>
        <Link to="/">
          <Button size="lg" className="px-16 py-6 shadow-2xl font-black text-xl rounded-2xl hover:scale-105 transform"><ArrowLeft className="w-6 h-6 mr-3" /> Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
