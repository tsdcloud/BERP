//protected route
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedRoutes() {
  const token = localStorage.getItem("token");


  useEffect(()=>{

  }, []);

  // return (
  //   <>
  //   {
  //     token != null ?
  //     <Outlet />:
  //     <Navigate to='/signIn' />
  //   }
  //   </>
  // );


  if (!token) {
    return <Navigate to="/signIn" />;
  }

  return <Outlet />;
};

