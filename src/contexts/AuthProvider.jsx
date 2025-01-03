import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';

export const AUTHCONTEXT = createContext();
// const { Provider } = AUTHCONTEXT();

export default function AuthProvider({children}) {
    const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth"));
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [userData, setUserData] = useState(JSON.stringify(token));
    

    useEffect(()=> {
      localStorage.setItem("isAuth", isAuth);
      localStorage.setItem("token", (token));
    }, [isAuth, token]);
    
  return (
    <AUTHCONTEXT.Provider value={{isAuth, setIsAuth, userData, setUserData, token, setToken}}>
        {children}
    </AUTHCONTEXT.Provider>
  );
}

