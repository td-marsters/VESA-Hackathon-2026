import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_HABITS = [
  { id: '1', name: 'Morning Walk', emoji: '🚶', reward: 2.5, completed: false, streak: 0 },
  { id: '2', name: 'Drink 8 glasses of water', emoji: '💧', reward: 1.0, completed: false, streak: 3 },
  { id: '3', name: 'Read for 20 mins', emoji: '📖', reward: 1.5, completed: false, streak: 7 },
];

export function AppProvider({ children }) {
  const [habits, setHabits] = useState(DEFUALT_HABITS); /**get from server */
  const [name, setName] = useState();
  const [toast, setToast] = useState(null);
  const [lastResetDate, setLastResetDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [habits]);

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

  //Overwrite
  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('vispendi_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.habits) setHabits(data.habits);
        if (data.balance !== undefined) setBalance(data.balance);
        if (data.lastResetDate) setLastResetDate(data.lastResetDate);
      }
    } catch (e) {
      console.error('Error loading data', e);
    }
  };

  //Overwrite
  const saveData = async () => {
    try {
      const data = { habits, balance, lastResetDate };
      await AsyncStorage.setItem('vispendi_data', JSON.stringify(data));
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
          setProgress(b => parseFloat((b + h.reward).toFixed(2)));
        } else {
          setProgress(b => parseFloat(Math.max(0, b - h.reward).toFixed(2)));
        }
        return {
          ...h,
          completed: completing
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
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? completedCount / habits.length : 0;

  return (
    <AppContext.Provider value={{
      habits, progress, completedCount, completionRate,
      toggleHabit, addHabit
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
