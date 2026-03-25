import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, ListOrdered } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';

export default function TransactionsList() {
  const { transactions, deleteTransaction, loading } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500 animate-pulse">
         <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
         <p className="font-medium">Loading your transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your income and expenses.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-[0_10px_20px_rgba(79,70,229,0.25)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
        >
          <Plus size={20} className="stroke-[3]" />
          <span>Add Transaction</span>
        </button>
      </header>

      <div className="glass-panel overflow-hidden p-1">
        <div className="overflow-x-auto rounded-[1.4rem]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 backdrop-blur-md border-b border-indigo-100/50 text-slate-500 text-sm tracking-wide">
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Date</th>
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Type</th>
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Category</th>
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Note</th>
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-right">Amount</th>
                <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/60 bg-white/30 backdrop-blur-sm">
              {transactions.length > 0 ? (
                transactions.map((t, idx) => (
                  <tr 
                    key={t.id} 
                    className="hover:bg-white/80 transition-all duration-300 group"
                    style={{ animation: `fade-in-up 0.4s ease-out ${idx * 0.05}s both` }}
                  >
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                        t.type === 'income' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {t.type === 'income' ? <ArrowUpRight size={14} className="stroke-[3]" /> : <ArrowDownRight size={14} className="stroke-[3]" />}
                        <span className="capitalize">{t.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                        {t.category}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 max-w-[200px] truncate">
                      {t.note || <span className="text-slate-300 italic">No note</span>}
                    </td>
                    <td className={`px-6 py-5 text-base font-extrabold text-right whitespace-nowrap ${
                      t.type === 'income' ? 'text-green-600' : 'text-slate-800'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-indigo-100 shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-red-100 shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                      <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center">
                        <ListOrdered size={32} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 text-lg">No transactions yet.</p>
                        <p className="text-sm">Keep tracking by adding your first record.</p>
                      </div>
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-sm mt-2 flex items-center gap-1 hover:underline underline-offset-4"
                      >
                        Add your first transaction <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          onClose={closeForm}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
}
