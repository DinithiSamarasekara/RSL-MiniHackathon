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
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500 animate-pulse">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    );
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
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ['Expenses Overview'],
    datasets: Object.keys(expensesByCategory).map((category, idx) => ({
      label: category,
      data: [expensesByCategory[category]],
      backgroundColor: pieData.datasets[0].backgroundColor[idx],
      borderRadius: 4,
    }))
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: "'Outfit', sans-serif" } } },
      tooltip: { titleFont: { family: "'Outfit', sans-serif" }, bodyFont: { family: "'Outfit', sans-serif" } }
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { font: { family: "'Outfit', sans-serif" } } },
      y: { stacked: true, border: { dash: [4, 4] }, grid: { color: '#e2e8f0', tickBorderDash: [4, 4] }, ticks: { font: { family: "'Outfit', sans-serif" } } }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Your money at a glance.</p>
        </div>
        {transactions.length === 0 && (
          <button 
            onClick={seedMockData}
            className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-bold shadow-sm transition-all duration-300 active:scale-95"
          >
            Load Mock Data
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel mesh-card-indigo p-6 flex flex-col gap-2 relative glass-card-hover group">
          <div className="w-12 h-12 bg-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2 shadow-sm border border-indigo-200/50 group-hover:scale-110 transition-transform duration-300">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-semibold text-slate-600">Total Balance</h3>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Rs. {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="glass-panel mesh-card-green p-6 flex flex-col gap-2 relative glass-card-hover group">
          <div className="w-12 h-12 bg-green-100/50 rounded-2xl flex items-center justify-center text-green-600 mb-2 shadow-sm border border-green-200/50 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-semibold text-slate-600">Total Income</h3>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Rs. {summary.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="glass-panel mesh-card-red p-6 flex flex-col gap-2 relative glass-card-hover group">
          <div className="w-12 h-12 bg-red-100/50 rounded-2xl flex items-center justify-center text-red-600 mb-2 shadow-sm border border-red-200/50 group-hover:scale-110 transition-transform duration-300">
            <TrendingDown size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-semibold text-slate-600">Total Expenses</h3>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Rs. {summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 glass-card-hover">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Expense Distribution</h3>
          <div className="relative h-72 w-full flex items-center justify-center">
            {Object.keys(expensesByCategory).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 20, font: { family: "'Outfit', sans-serif", size: 13 } } } } }} />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                 <PieChartIcon className="w-16 h-16 mb-4 opacity-20" />
                 <p className="font-medium">No expenses recorded.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel p-8 glass-card-hover">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Spending Overview</h3>
          <div className="relative h-72 w-full flex items-center justify-center">
             {Object.keys(expensesByCategory).length > 0 ? (
                <Bar data={barData} options={{ maintainAspectRatio: false, ...barOptions }} />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                   <BarChartIcon className="w-16 h-16 mb-4 opacity-20" />
                   <p className="font-medium">No expenses recorded.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PieChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)

const BarChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)
