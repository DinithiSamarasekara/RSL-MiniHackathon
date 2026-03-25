import React, { useState, useEffect } from 'react';
import { useFinance, CATEGORIES } from '../contexts/FinanceContext';
import { X, Check } from 'lucide-react';

export default function TransactionForm({ onClose, initialData }) {
  const { addTransaction, editTransaction } = useFinance();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      editTransaction(initialData.id, formData);
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="px-8 py-6 border-b border-indigo-50/80 flex items-center justify-between bg-white/40">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {initialData ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button 
             onClick={onClose} 
             className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-all hover:rotate-90"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-3 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2 ${
                formData.type === 'expense' 
                  ? 'bg-white text-red-600 shadow-[0_4px_12px_rgba(220,38,38,0.1)] border-transparent scale-100 ring-1 ring-red-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/40 scale-95 hover:scale-100'
              }`}
              onClick={() => setFormData({...formData, type: 'expense'})}
            >
              Expense
            </button>
            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2 ${
                formData.type === 'income' 
                  ? 'bg-white text-green-600 shadow-[0_4px_12px_rgba(22,163,74,0.1)] border-transparent scale-100 ring-1 ring-green-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/40 scale-95 hover:scale-100'
              }`}
              onClick={() => setFormData({...formData, type: 'income'})}
            >
              Income
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 pl-1">Amount</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg group-focus-within:text-indigo-500 transition-colors">Rs.</span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-lg text-slate-800 shadow-sm"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 pl-1">Category</label>
              <select
                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 shadow-sm appearance-none cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="font-semibold">{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 pl-1">Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-white/50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 shadow-sm"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 pl-1">Note (Optional)</label>
            <input
              type="text"
              placeholder="E.g., Groceries from Whole Foods"
              className="w-full px-4 py-3 bg-white/50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 shadow-sm placeholder:text-slate-400"
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <div className="pt-6 mt-2 border-t border-indigo-50/80 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-[0_8px_20px_rgba(79,70,229,0.3)] min-w-[120px] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group"
            >
              {initialData ? 'Update' : 'Save'}
              <Check size={18} className="stroke-[3] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
