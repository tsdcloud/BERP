import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';

export const AUTHCONTEXT = createContext();
// const { Provider } = AUTHCONTEXT();

export default function AuthProvider({children}) {
    const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth"));
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh, setRefresh] = useState(() => localStorage.getItem("refresh"));
    const [userData, setUserData] = useState(JSON.stringify(token));

    const disconnect = () => {
      localStorage.removeItem("isAuth");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token");
      setIsAuth(false);
      setToken(null);
      setRefresh(null);
      setUserData(null);
    };

    useEffect(()=> {
      localStorage.setItem("isAuth", isAuth);
      localStorage.setItem("token", (token));
      localStorage.setItem("refresh", (refresh));
    }, [isAuth, token, refresh]);
    
  return (
    <AUTHCONTEXT.Provider value={{isAuth, setIsAuth, userData, setUserData, token, setToken, refresh, setRefresh, disconnect}}>
        {children}
    </AUTHCONTEXT.Provider>
  );
}

