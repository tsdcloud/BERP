//protected route
import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import Preloader from '../components/Preloader';
import { useFetch } from '../hooks/useFetch';

export default function ProtectedRoutes() {
  const {handleFetch} = useFetch();

  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");


  useEffect(()=>{

  }, []);

  return (
    <>
    {
      token != null ?
      <Outlet />:
      <Navigate to='/signIn' />
    }
    </>
  );
};

