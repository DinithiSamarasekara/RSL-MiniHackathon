import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { CheckCircle2, XCircle, BarChart3, HelpCircle, ArrowLeft } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Exam Results</h1>
        <p className="text-xl text-gray-600 font-medium">{paper.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center border-t-4 border-t-blue-500 shadow-md">
          <CardContent className="pt-8 pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-5xl font-black text-gray-900 mb-2">{scorePercentage}%</div>
            <div className="text-sm font-semibold uppercase tracking-widest text-gray-500">Overall Score</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader title="Performance Summary" />
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
              <div className="p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">{correctCount}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Correct</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-red-600 mb-1">{incorrectCount}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Incorrect</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-gray-400 mb-1">{unattemptedCount}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Unanswered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Detailed Review
        </h2>
        <div className="space-y-6">
          {paper.questions.map((q, idx) => {
            const selected = answers[idx];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctAnswerIndex;

            return (
              <Card key={idx} className={`border-l-4 shadow-sm overflow-hidden ${!isAnswered ? 'border-l-gray-300' : isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex gap-4 items-start">
                  <div className={`mt-1 flex-shrink-0 ${!isAnswered ? 'text-gray-400' : isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      <span className="text-gray-500 mr-2">Q{idx + 1}.</span> {q.questionText}
                    </h3>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "p-4 rounded-xl border-2 transition-all flex items-center justify-between ";
                      
                      if (oIdx === q.correctAnswerIndex) {
                        btnClass += "border-green-500 bg-green-50 text-green-900 font-medium shadow-sm";
                      } else if (oIdx === selected && !isCorrect) {
                        btnClass += "border-red-500 bg-red-50 text-red-900 shadow-sm";
                      } else {
                        btnClass += "border-gray-100 bg-white text-gray-600 opacity-60";
                      }

                      return (
                        <div key={oIdx} className={btnClass}>
                          <span>{opt}</span>
                          {oIdx === q.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                          {oIdx === selected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {!isAnswered && (
                    <div className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium mb-4">
                      You did not answer this question.
                    </div>
                  )}

                  {q.explanation && (
                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 mt-2">
                      <span className="font-bold text-blue-900 block mb-2 tracking-wide text-sm uppercase">Explanation</span>
                      <p className="text-blue-800/90 leading-relaxed text-sm md:text-base">{q.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-12 border-t mt-12">
        <Link to="/">
          <Button size="lg" className="px-12 font-semibold shadow-md"><ArrowLeft className="w-5 h-5 mr-3" /> Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
