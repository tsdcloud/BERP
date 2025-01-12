import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';

export const AUTHCONTEXT = createContext();
// const { Provider } = AUTHCONTEXT();

export default function AuthProvider({children}) {
    const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth"));
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [userData, setUserData] = useState(JSON.stringify(token));

    const disconnect = () => {
      localStorage.clear()
      setIsAuth(false);
      setToken(null);
      setUserData(null);
    }

    useEffect(()=> {
      localStorage.setItem("isAuth", isAuth);
      localStorage.setItem("token", (token));
    }, [isAuth, token]);
    
  return (
    <AUTHCONTEXT.Provider value={{isAuth, setIsAuth, userData, setUserData, token, setToken, disconnect}}>
        {children}
    </AUTHCONTEXT.Provider>
  );
}

