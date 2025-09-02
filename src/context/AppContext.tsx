"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { startOfMonth, isSameMonth, getMonth, getYear } from 'date-fns';

export interface FixedIncome {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  received: boolean;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  paid: boolean;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  fixed: boolean;
}

interface AppState {
  balance: number;
  fixedIncomes: FixedIncome[];
  fixedExpenses: FixedExpense[];
  savingsGoalWeekly: number;
  savedThisMonth: number;
  transactions: Transaction[];
  lastMonth: number;
  lastYear: number;
  onboardingComplete: boolean;
}

interface AppContextType {
  state: AppState;
  updateBalance: (newBalance: number) => void;
  addFixedIncome: (income: Omit<FixedIncome, 'id' | 'received'>) => void;
  addFixedExpense: (expense: Omit<FixedExpense, 'id' | 'paid'>) => void;
  setSavingsGoalWeekly: (goal: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  markIncomeReceived: (id: string) => void;
  markExpensePaid: (id: string) => void;
  addToSavings: (amount: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setInitialBalance: (balance: number) => void;
  updateFixedIncomes: (incomes: FixedIncome[]) => void;
  updateFixedExpenses: (expenses: FixedExpense[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert dates
        parsed.transactions = parsed.transactions.map((t: any) => ({ ...t, date: new Date(t.date) }));
        return parsed;
      }
    }
    return {
      balance: 0,
      fixedIncomes: [],
      fixedExpenses: [],
      savingsGoalWeekly: 0,
      savedThisMonth: 0,
      transactions: [],
      lastMonth: getMonth(new Date()),
      lastYear: getYear(new Date()),
      onboardingComplete: false,
    };
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = getMonth(currentDate);
    const currentYear = getYear(currentDate);

    if (currentMonth !== state.lastMonth || currentYear !== state.lastYear) {
      setState(prev => ({
        ...prev,
        fixedIncomes: prev.fixedIncomes.map(inc => ({ ...inc, received: false })),
        fixedExpenses: prev.fixedExpenses.map(exp => ({ ...exp, paid: false })),
        savedThisMonth: 0,
        lastMonth: currentMonth,
        lastYear: currentYear,
      }));
    }
  }, [state.lastMonth, state.lastYear]);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const updateBalance = (newBalance: number) => {
    setState(prev => ({ ...prev, balance: newBalance }));
  };

  const addFixedIncome = (income: Omit<FixedIncome, 'id' | 'received'>) => {
    setState(prev => ({
      ...prev,
      fixedIncomes: [...prev.fixedIncomes, { ...income, id: uuidv4(), received: false }],
    }));
  };

  const addFixedExpense = (expense: Omit<FixedExpense, 'id' | 'paid'>) => {
    setState(prev => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, { ...expense, id: uuidv4(), paid: false }],
    }));
  };

  const setSavingsGoalWeekly = (goal: number) => {
    setState(prev => ({ ...prev, savingsGoalWeekly: goal }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = { ...transaction, id: uuidv4(), date: new Date() };
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
      balance: transaction.type === 'income' 
        ? prev.balance + transaction.amount 
        : prev.balance - transaction.amount,
    }));

    // Learn fixed expense
    if (transaction.type === 'expense' && transaction.fixed) {
      const existing = prev.fixedExpenses.find(exp => exp.name.toLowerCase() === transaction.category.toLowerCase());
      if (!existing) {
        addFixedExpense({ name: transaction.category, amount: transaction.amount, dueDay: new Date().getDate() });
      }
    }
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setState(prev => {
      const oldTransaction = prev.transactions.find(t => t.id === id);
      if (!oldTransaction) return prev;

      const newTransactions = prev.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );

      // Adjust balance if amount or type changed
      let balanceAdjustment = 0;
      if (updates.amount !== undefined || updates.type !== undefined) {
        // Reverse old
        balanceAdjustment += oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;
        // Apply new
        const newType = updates.type || oldTransaction.type;
        const newAmount = updates.amount || oldTransaction.amount;
        balanceAdjustment += newType === 'income' ? newAmount : -newAmount;
      }

      return {
        ...prev,
        transactions: newTransactions,
        balance: prev.balance + balanceAdjustment,
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setState(prev => {
      const transaction = prev.transactions.find(t => t.id === id);
      if (!transaction) return prev;

      const newTransactions = prev.transactions.filter(t => t.id !== id);
      const balanceAdjustment = transaction.type === 'income' ? -transaction.amount : transaction.amount;

      return {
        ...prev,
        transactions: newTransactions,
        balance: prev.balance + balanceAdjustment,
      };
    });
  };

  const markIncomeReceived = (id: string) => {
    setState(prev => {
      const income = prev.fixedIncomes.find(inc => inc.id === id);
      if (!income || income.received) return prev;

      return {
        ...prev,
        fixedIncomes: prev.fixedIncomes.map(inc => 
          inc.id === id ? { ...inc, received: true } : inc
        ),
        balance: prev.balance + income.amount,
      };
    });
  };

  const markExpensePaid = (id: string) => {
    setState(prev => {
      const expense = prev.fixedExpenses.find(exp => exp.id === id);
      if (!expense || expense.paid) return prev;

      return {
        ...prev,
        fixedExpenses: prev.fixedExpenses.map(exp => 
          exp.id === id ? { ...exp, paid: true } : exp
        ),
        balance: prev.balance - expense.amount,
      };
    });
  };

  const addToSavings = (amount: number) => {
    setState(prev => ({ ...prev, savedThisMonth: prev.savedThisMonth + amount }));
  };

  const setOnboardingComplete = (complete: boolean) => {
    setState(prev => ({ ...prev, onboardingComplete: complete }));
  };

  const setInitialBalance = (balance: number) => {
    setState(prev => ({ ...prev, balance }));
  };

  const updateFixedIncomes = (incomes: FixedIncome[]) => {
    setState(prev => ({ ...prev, fixedIncomes: incomes }));
  };

  const updateFixedExpenses = (expenses: FixedExpense[]) => {
    setState(prev => ({ ...prev, fixedExpenses: expenses }));
  };

  return (
    <AppContext.Provider value={{
      state,
      updateBalance,
      addFixedIncome,
      addFixedExpense,
      setSavingsGoalWeekly,
      addTransaction,
      editTransaction,
      deleteTransaction,
      markIncomeReceived,
      markExpensePaid,
      addToSavings,
      setOnboardingComplete,
      setInitialBalance,
      updateFixedIncomes,
      updateFixedExpenses,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};