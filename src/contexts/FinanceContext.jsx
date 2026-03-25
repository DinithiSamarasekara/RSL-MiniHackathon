import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Salary', 'Other'];

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const txs = [];
      querySnapshot.forEach((doc) => {
        txs.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(txs);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addTransaction = async (transaction) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        uid: currentUser.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  };

  const editTransaction = async (id, updatedTransaction) => {
    if (!currentUser) return;
    try {
      const txRef = doc(db, 'transactions', id);
      await updateDoc(txRef, updatedTransaction);
    } catch (error) {
      console.error('Error updating transaction: ', error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!currentUser) return;
    try {
      const txRef = doc(db, 'transactions', id);
      await deleteDoc(txRef);
    } catch (error) {
      console.error('Error deleting transaction: ', error);
    }
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
        loading
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
