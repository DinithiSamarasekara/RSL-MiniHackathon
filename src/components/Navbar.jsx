import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, LayoutDashboard, ListOrdered, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ListOrdered },
  ];

  if (!currentUser) {
    return (
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-indigo-100/50 shadow-sm px-4 py-3 md:px-8 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-2 text-indigo-600 hover:scale-105 transition-transform duration-300">
            <Wallet size={28} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
              FinTrack
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-indigo-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] px-4 py-3 md:px-8 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 hover:scale-105 transition-transform duration-300">
          <Wallet size={28} strokeWidth={2.5} />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent hidden sm:block drop-shadow-sm">
            FinTrack
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100/50 p-1.5 rounded-2xl border border-white/60 shadow-inner">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300',
                  isActive 
                    ? 'bg-white text-indigo-700 shadow-sm border border-indigo-50/50 scale-100 ring-1 ring-indigo-100' 
                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-800 scale-95 hover:scale-100'
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden sm:block">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-slate-200/60 ml-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{currentUser.displayName}</span>
            <span className="text-xs font-medium text-slate-500 leading-none">{currentUser.email}</span>
          </div>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full shadow-md border-2 border-white hover:scale-110 transition-transform duration-300" />
          ) : (
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform duration-300">
               {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
             </div>
          )}
          <button
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 active:scale-95 ml-1 bg-white/50 border border-transparent hover:border-red-100"
            title="Log out"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  );
}
