import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const { transactions, summary, balance, loading, seedMockData } = useFinance();

  if (loading) {
    return <div className="flex items-center justify-center p-20 text-slate-500">Loading dashboard...</div>;
  }

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + Number(current.amount);
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Expenses Overview'],
    datasets: Object.keys(expensesByCategory).map((category, idx) => ({
      label: category,
      data: [expensesByCategory[category]],
      backgroundColor: pieData.datasets[0].backgroundColor[idx],
    }))
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="text-sm text-slate-500">Your financial summary at a glance.</p>
        </div>
        {transactions.length === 0 && (
          <button 
            onClick={seedMockData}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-sm font-medium transition-colors"
          >
            Load Mock Data
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full transition-transform group-hover:scale-150" />
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <DollarSign size={20} />
            <h3 className="font-medium">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${balance.toFixed(2)}</p>
        </div>
        
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full transition-transform group-hover:scale-150" />
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp size={20} />
            <h3 className="font-medium">Total Income</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${summary.income.toFixed(2)}</p>
        </div>
        
        <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full transition-transform group-hover:scale-150" />
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <TrendingDown size={20} />
            <h3 className="font-medium">Total Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${summary.expense.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Expense Distribution</h3>
          <div className="relative h-64 w-full flex justify-center">
            {Object.keys(expensesByCategory).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">No expenses recorded.</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Spending Overview</h3>
          <div className="relative h-64 w-full flex justify-center">
             {Object.keys(expensesByCategory).length > 0 ? (
                <Bar data={barData} options={{ maintainAspectRatio: false, ...barOptions }} />
              ) : (
                <div className="flex items-center justify-center text-slate-400 h-full">No expenses recorded.</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
