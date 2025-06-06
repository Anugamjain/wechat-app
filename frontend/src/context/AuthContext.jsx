import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activated, setActivated] = useState(false);

  const login = () => { setIsAuthenticated(true); }
  const logout = () => setIsAuthenticated(false);

  const activateUser = () => setActivated(true);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, activated, activateUser}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
