export function Card({ className, children }) {
  return (
    <div className={`bg-white shadow rounded-lg border border-gray-200 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, children }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`px-6 py-4 ${className || ''}`}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className || ''}`}>{children}</div>;
}
