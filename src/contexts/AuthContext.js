import {createContext, useState} from 'react';

export const authProvider = createContext();
const { Provider } = authProvider();

export default function AuthContext({children}) {
    const [isAuth, setIsAuth] = useState('');
    const [userData, setUserData] = useState();
    
    
  return (
    <Provider value={{isAuth, setIsAuth, userData, setUserData}}>
        {children}
    </Provider>
  );
}
