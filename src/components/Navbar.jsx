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
      <nav className="sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-2 text-indigo-600">
            <Wallet size={28} strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3 md:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Wallet size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent hidden sm:block">
            FinTrack
          </span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon size={18} />
                <span className="hidden sm:block">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">{currentUser.displayName}</span>
            <span className="text-xs text-slate-500 leading-none">{currentUser.email}</span>
          </div>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full shadow-sm border border-slate-200" />
          ) : (
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
               {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
             </div>
          )}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
