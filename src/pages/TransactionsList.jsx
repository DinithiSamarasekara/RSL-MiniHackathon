import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, ListOrdered } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';

export default function TransactionsList() {
  const { transactions, deleteTransaction } = useFinance();
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="text-sm text-slate-500">Manage your income and expenses.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Note</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span className="capitalize">{t.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {t.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                      {t.note || '-'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${
                      t.type === 'income' ? 'text-green-600' : 'text-slate-900'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ListOrdered size={32} className="text-slate-300 mb-2" />
                      <p>No transactions found.</p>
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-2"
                      >
                        Add your first transaction →
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
