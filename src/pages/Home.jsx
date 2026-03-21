import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/Card';
import { Clock, HelpCircle } from 'lucide-react';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">ISTQB QA Exam Platform</h1>
        <p className="text-lg text-gray-500">Practice and prepare with our mock exams. Choose between <span className="font-medium text-gray-900">Practice</span> mode for immediate feedback, or <span className="font-medium text-gray-900">Exam</span> mode to simulate real conditions.</p>
      </div>

      {papers.length === 0 ? (
        <p className="text-gray-500 mt-12 text-lg">No exam papers available at the moment. Please check back later.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {papers.map((paper) => (
            <Card key={paper.id} className="flex flex-col h-full border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader title={paper.title} />
              <CardContent className="flex-1">
                <p className="text-gray-600 mb-6 text-sm line-clamp-3">{paper.description}</p>
                <div className="flex flex-col gap-3 text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span>{paper.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{paper.timeLimit} Minutes limit</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 justify-end mt-auto">
                <Link to={`/practice/${paper.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">Practice</Button>
                </Link>
                <Link to={`/exam/${paper.id}`} className="flex-1">
                  <Button variant="primary" className="w-full">Exam Mode</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
