import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button } from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import Timer from '../components/Timer';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    navigate('/result', {
      state: { paper, answers }
    });
  };

  const handleSelect = (idx) => {
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

  if (loading) return <div className="text-center py-12">Loading Exam...</div>;
  if (!paper) return null;

  if (!examStarted) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{paper.title}</h1>
        <p className="text-gray-600 mb-8">{paper.description}</p>
        <div className="bg-blue-50 text-blue-900 p-8 rounded-2xl mb-8 border border-blue-200 shadow-sm text-left">
          <h3 className="font-bold text-xl mb-4 text-blue-950">Exam Rules & Guidelines:</h3>
          <ul className="list-disc pl-5 space-y-3 text-sm md:text-base opacity-90">
            <li>Time Limit: <strong>{paper.timeLimit} Minutes</strong>. Timer will remain sticky at the top.</li>
            <li>Total Questions: <strong>{paper.questions.length}</strong></li>
            <li>Once the timer ends, your exam will be automatically submitted without warning.</li>
            <li>You can navigate back and forth between questions using the map or buttons.</li>
            <li><strong>Do not refresh the page.</strong> Your progress is not saved locally.</li>
          </ul>
        </div>
        <Button size="lg" className="w-full text-lg shadow-md font-semibold h-14" onClick={() => setExamStarted(true)}>
          Start Exam
        </Button>
      </div>
    );
  }

  const currentQ = paper.questions[currentQIndex];
  const selectedAnswer = answers[currentQIndex];
  const attemptedCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-sm pb-4 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm rounded-b-xl">
        <div className="flex-1 w-full text-center sm:text-left">
          <h2 className="font-bold text-gray-900 truncate">{paper.title}</h2>
          <div className="text-sm text-gray-500 font-medium mt-1">
            Attempted: <span className="text-blue-600">{attemptedCount}</span> / {paper.questions.length}
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <Timer initialMinutes={paper.timeLimit} onTimeUp={handleSubmit} />
          <Button variant="danger" onClick={() => {
            if(confirm('Are you sure you want to finish and submit the exam early?')) handleSubmit();
          }}>
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-md border-gray-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex gap-4 items-start mb-8">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {currentQIndex + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-serif text-gray-900 mt-1 leading-snug">{currentQ.questionText}</h3>
              </div>
              
              <div className="space-y-4 ml-0 sm:ml-14">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === idx 
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedAnswer === idx ? 'border-blue-500' : 'border-gray-300'}`}>
                        {selectedAnswer === idx && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                      </div>
                      <span className={`text-base ${selectedAnswer === idx ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-gray-50 p-6 border-t border-gray-100">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQIndex === 0} className="w-28 bg-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Prev
              </Button>
              <div className="hidden sm:block text-sm text-gray-400 font-medium uppercase tracking-wider">
                Q {currentQIndex + 1} of {paper.questions.length}
              </div>
              <Button variant="outline" onClick={nextQuestion} disabled={currentQIndex === paper.questions.length - 1} className="w-28 bg-white">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[160px] shadow-sm border-gray-200 rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <h4 className="font-bold text-gray-900 mb-4 text-xs xl:text-sm uppercase tracking-wider border-b pb-2">Question Map</h4>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {paper.questions.map((_, idx) => {
                  const isAnswered = answers[idx] !== undefined;
                  const isCurrent = currentQIndex === idx;
                  let btnClass = "w-full aspect-square rounded-md font-semibold text-xs xl:text-sm flex items-center justify-center border-2 transition-colors ";
                  
                  if (isCurrent) btnClass += "border-blue-600 bg-blue-50 text-blue-700 shadow-inner ";
                  else if (isAnswered) btnClass += "border-green-500 bg-green-50 text-green-700 ";
                  else btnClass += "border-gray-200 bg-white text-gray-500 hover:border-gray-300 ";

                  return (
                    <button key={idx} onClick={() => setCurrentQIndex(idx)} className={btnClass}>
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t space-y-3 text-xs xl:text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-50 border-2 border-blue-600 rounded"></div> Current</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-50 border-2 border-green-500 rounded"></div> Attempted</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div> Unanswered</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
