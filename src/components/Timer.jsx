import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ initialMinutes, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
      <Clock className={timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-600'} />
      <span className={timeLeft < 60 ? 'text-red-600' : ''}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
