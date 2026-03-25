import React, { createContext, useState, useContext } from 'react';

const initialTransactions = [
  { id: 1, type: 'expense', amount: 50, category: 'Food', date: '2026-03-01', note: 'Groceries' },
  { id: 2, type: 'income', amount: 3000, category: 'Salary', date: '2026-03-01', note: 'March Salary' },
  { id: 3, type: 'expense', amount: 150, category: 'Transport', date: '2026-03-02', note: 'Gas' },
  { id: 4, type: 'expense', amount: 200, category: 'Bills', date: '2026-03-05', note: 'Electricity' },
  { id: 5, type: 'expense', amount: 80, category: 'Entertainment', date: '2026-03-10', note: 'Movie' }
];

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Salary', 'Other'];

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now() }, ...prev]);
  };

  const editTransaction = (id, updatedTransaction) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...updatedTransaction, id } : t)));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += Number(t.amount);
      if (t.type === 'expense') acc.expense += Number(t.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = summary.income - summary.expense;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        summary,
        balance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
