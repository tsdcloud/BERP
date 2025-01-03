//protected route
import { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import Preloader from '../components/Preloader';
import SignInLayout from '../components/layout/SignInLayout';
import { useFetch } from '../hooks/useFetch';

export default function ProtectedRoutes() {
  const {token, setToken, setUserInfo} = useContext(AUTHCONTEXT);
  const {handleFetch} = useFetch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const handleRefreshToken = async () =>{
      try {
        let response = await handleFetch(`/api/refresh`);
        if(response?.ok){
          setToken(response?.access);
          let decodedToken = jwtDecode(response?.access);
          setUserInfo(decodedToken);
          return;
        }
      } catch (error) {
        setToken("");
      }finally{
        setIsLoading(false);
      }
    }
    if(token === ""){
      console.log('No token');
      handleRefreshToken();
    }else{
      setIsLoading(false);
    }
  }, []);

  return (
    <>
    {  
    isLoading ? <Preloader />:
    token.length > 0 ?
      <SignInLayout >
          <Outlet />
      </SignInLayout>:
      <Navigate to='/signIn' />}
    </>
  );
};

