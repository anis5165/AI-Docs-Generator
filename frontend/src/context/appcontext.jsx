'use client';
import { createContext, useContext, useState } from "react";

const AppContext = createContext();


export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

  return (
    <AppContext.Provider value={{login, logout, user}}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
    return useContext(AppContext);
}