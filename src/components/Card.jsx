export function Card({ className, children }) {
  return (
    <div className={`bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border border-slate-200 overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, children }) {
  return (
    <div className="px-6 py-5 border-b border-slate-100/80 bg-white/40 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-slate-500 font-medium">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`p-6 ${className || ''}`}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={`px-6 py-5 border-t border-slate-100 bg-slate-50/50 ${className || ''}`}>{children}</div>;
}
