import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();


export function AppProvider({ children }) {

  return (
    <AppContext.Provider >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
