import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] shadow-sm';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:-translate-y-0.5 border border-transparent',
    secondary: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:shadow-md hover:-translate-y-0.5',
    outline: 'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 shadow-none',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:shadow-md border border-transparent'
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 py-2 text-sm',
    lg: 'h-14 px-8 text-base tracking-wide'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
