import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, LayoutDashboard, ListOrdered } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ListOrdered },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3 md:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Wallet size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            FinTrack
          </span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-4">
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
      </div>
    </nav>
  );
}
