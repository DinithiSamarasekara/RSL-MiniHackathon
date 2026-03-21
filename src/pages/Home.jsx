import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Clock, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'papers'));
        const paperData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPapers(paperData);
      } catch (error) {
        console.error("Error fetching papers: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl animated-bg p-8 sm:p-16 shadow-lg border border-white/40 mb-12 flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-white/30 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-blue-800 text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Master Your Certification</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Elevate Your <span className="gradient-text drop-shadow-sm">QA Skills</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Practice with premium mock exams. Choose <strong className="text-indigo-900 font-bold">Practice Mode</strong> for immediate feedback or <strong className="text-pink-900 font-bold">Exam Mode</strong> to simulate the real test.
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Available Exams</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-8 hidden sm:block"></div>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No exam papers available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <Card key={paper.id} className="group relative glass-panel border border-white/60 hover:border-blue-200 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader title={
                    <span className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                      {paper.title}
                    </span>
                  }
                />
                <CardContent className="flex-1 px-6 pt-2 pb-6">
                  <p className="text-slate-600 mb-6 text-sm line-clamp-3 leading-relaxed">{paper.description}</p>
                  
                  <div className="flex gap-4 mb-2">
                    <div className="flex-1 bg-white/60 rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Questions</div>
                        <div className="font-bold text-slate-900">{paper.questions?.length || 0}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white/60 rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Time Limit</div>
                        <div className="font-bold text-slate-900">{paper.timeLimit}m</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 px-6 py-5 bg-slate-50/50 border-t border-slate-100">
                  <Link to={`/practice/${paper.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-slate-200">Practice</Button>
                  </Link>
                  <Link to={`/exam/${paper.id}`} className="flex-1">
                    <Button variant="primary" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none shadow-md hover:shadow-lg transition-all">
                      Exam <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
