import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      alert('Failed to log in');
    }
  };

  return (
    <div className="min-h-screen -mt-20 w-full flex items-center justify-center p-4 mesh-bg-login absolute inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>
      
      <div className="relative glass-panel p-8 md:p-12 w-full max-w-md flex flex-col items-center text-center animate-fade-in-up border-white/20 shadow-2xl shadow-indigo-900/20 bg-white/10 backdrop-blur-3xl">
        <div className="w-20 h-20 bg-white/20 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-white/30 backdrop-blur-md animate-[pulse-slow_4s_ease-in-out_infinite]">
          <Wallet size={36} strokeWidth={2} />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3 drop-shadow-sm">
          FinTrack
        </h1>
        <p className="text-indigo-100 font-medium mb-10 text-lg">
          Master your money, beautifully.
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-white text-slate-800 font-semibold py-3.5 px-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
