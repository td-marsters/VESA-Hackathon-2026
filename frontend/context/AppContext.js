import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_HABITS = [
  { id: '1', name: 'Morning Walk', emoji: '🚶', reward: 2.5, completed: false, streak: 0 },
  { id: '2', name: 'Drink 8 glasses of water', emoji: '💧', reward: 1.0, completed: false, streak: 3 },
  { id: '3', name: 'Read for 20 mins', emoji: '📖', reward: 1.5, completed: false, streak: 7 },
];

export function AppProvider({ children }) {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [lastResetDate, setLastResetDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [habits, balance, totalEarned, totalSpent, transactions]);

  // Auto-reset habits at midnight
  useEffect(() => {
    const checkReset = () => {
      const today = new Date().toDateString();
      if (lastResetDate && lastResetDate !== today) {
        resetDailyHabits();
        setLastResetDate(today);
      } else if (!lastResetDate) {
        setLastResetDate(today);
      }
    };
    checkReset();
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('lifebank_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.habits) setHabits(data.habits);
        if (data.balance !== undefined) setBalance(data.balance);
        if (data.totalEarned !== undefined) setTotalEarned(data.totalEarned);
        if (data.totalSpent !== undefined) setTotalSpent(data.totalSpent);
        if (data.transactions) setTransactions(data.transactions);
        if (data.lastResetDate) setLastResetDate(data.lastResetDate);
      }
    } catch (e) {
      console.error('Error loading data', e);
    }
  };

  const saveData = async () => {
    try {
      const data = { habits, balance, totalEarned, totalSpent, transactions, lastResetDate };
      await AsyncStorage.setItem('lifebank_data', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data', e);
    }
  };

  const resetDailyHabits = () => {
    setHabits(prev =>
      prev.map(h => ({
        ...h,
        completed: false,
      }))
    );
  };

  const toggleHabit = (id) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const completing = !h.completed;
        if (completing) {
          setBalance(b => parseFloat((b + h.reward).toFixed(2)));
          setTotalEarned(t => parseFloat((t + h.reward).toFixed(2)));
          setTransactions(tx => [
            { id: Date.now().toString(), type: 'earn', label: h.name, amount: h.reward, date: new Date().toISOString() },
            ...tx,
          ]);
        } else {
          setBalance(b => parseFloat(Math.max(0, b - h.reward).toFixed(2)));
          setTotalEarned(t => parseFloat(Math.max(0, t - h.reward).toFixed(2)));
          setTransactions(tx => tx.filter(t => !(t.label === h.name && t.type === 'earn')));
        }
        return {
          ...h,
          completed: completing,
          streak: completing ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      })
    );
  };

  const addHabit = (name, emoji, reward) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      emoji,
      reward: parseFloat(reward),
      completed: false,
      streak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits(prev => {
      const habit = prev.find(h => h.id === id);
      if (habit?.completed) {
        setBalance(b => parseFloat(Math.max(0, b - habit.reward).toFixed(2)));
      }
      return prev.filter(h => h.id !== id);
    });
  };

  const spendMoney = (amount, label) => {
    const spend = parseFloat(amount);
    if (spend > balance) return false;
    setBalance(b => parseFloat((b - spend).toFixed(2)));
    setTotalSpent(t => parseFloat((t + spend).toFixed(2)));
    setTransactions(tx => [
      { id: Date.now().toString(), type: 'spend', label, amount: spend, date: new Date().toISOString() },
      ...tx,
    ]);
    return true;
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? completedCount / habits.length : 0;

  return (
    <AppContext.Provider value={{
      habits, balance, totalEarned, totalSpent, transactions,
      completedCount, completionRate,
      toggleHabit, addHabit, deleteHabit, spendMoney,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
