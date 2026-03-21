import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button } from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PracticeMode() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Track selected answers: index -> option selected
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

  if (loading) return <div className="text-center py-12">Loading Practice Mode...</div>;
  if (!paper || !paper.questions || paper.questions.length === 0) return <div className="text-center">No questions found!</div>;

  const currentQ = paper.questions[currentQIndex];
  const selectedAnswer = answers[currentQIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === currentQ.correctAnswerIndex;

  const handleSelect = (idx) => {
    if (isAnswered) return; // Prevent changing answer in practice mode
    setAnswers({ ...answers, [currentQIndex]: idx });
  };

  const nextQuestion = () => {
    if (currentQIndex < paper.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const score = Object.keys(answers).reduce((acc, qIdx) => {
    return acc + (answers[qIdx] === paper.questions[qIdx].correctAnswerIndex ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
        <span>Practice Mode - {paper.title}</span>
        <span>Question {currentQIndex + 1} of {paper.questions.length}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentQIndex + 1) / paper.questions.length) * 100}%` }}></div>
      </div>

      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex gap-4 items-start mb-6">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm">
              Q{currentQIndex + 1}
            </span>
            <h2 className="text-xl font-medium text-gray-900 mt-1">{currentQ.questionText}</h2>
          </div>
          
          <div className="space-y-3 ml-12">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full justify-start text-left h-auto py-3 px-4 rounded-xl border-2 transition-all ";
              if (!isAnswered) {
                btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white";
              } else {
                if (idx === currentQ.correctAnswerIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-900 font-medium";
                } else if (idx === selectedAnswer && !isCorrect) {
                  btnClass += "border-red-500 bg-red-50 text-red-900";
                } else {
                  btnClass += "border-gray-200 bg-gray-50 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    {isAnswered && idx === selectedAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className={`mt-8 p-5 rounded-xl border ml-12 ${isCorrect ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
              <div className="flex items-center gap-2 font-bold mb-2">
                {isCorrect ? <><CheckCircle2 className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> Incorrect.</>}
              </div>
              {!isCorrect && <p className="mb-3">The correct answer was: <strong className="font-semibold">{currentQ.options[currentQ.correctAnswerIndex]}</strong></p>}
              {currentQ.explanation && (
                <div className="mt-3 pt-3 border-t border-opacity-30 border-current text-sm">
                  <span className="font-semibold block mb-1">Explanation:</span>
                  <div className="opacity-90 leading-relaxed">{currentQ.explanation}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            Score: <span className="text-gray-900">{score}</span> / {Object.keys(answers).length}
          </div>

          {currentQIndex < paper.questions.length - 1 ? (
            <Button onClick={nextQuestion}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/')} variant="primary">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Finish
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
