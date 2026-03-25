import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Wallet, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-sans">
      
      {/* Animated Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px]"></div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOS0zOXYzOEgyVjJoMzd6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-50"></div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Decorative top border glow */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-70"></div>
        
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

          {/* Logo/Icon Area */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
              <Wallet size={36} strokeWidth={2.5} />
              <Sparkles size={16} className="absolute top-3 right-3 text-indigo-100 opacity-80" />
            </div>
          </div>
          
          {/* Typography */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">FinTrack</span>
          </h1>
          <p className="text-slate-400 font-medium mb-10 text-base leading-relaxed max-w-[280px]">
            Your personal finance dashboard, redesigned for the future.
          </p>

          {/* Action Button */}
          <button
            onClick={handleLogin}
            className="group relative w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            {/* Button Hover effect */}
            <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <svg className="relative w-6 h-6 z-10 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span className="relative z-10">Continue with Google</span>
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium bg-slate-800/50 py-2 px-4 rounded-full border border-slate-700/50">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Secure, encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
