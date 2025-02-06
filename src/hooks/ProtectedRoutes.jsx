//protected route
import { useEffect, useContext, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import { URLS } from '../../configUrl';
import { useFetch } from './useFetch';
import Preloader from '../components/Preloader';

export default function ProtectedRoutes() {
  const { token, setToken, refresh, setRefresh, isAuth } = useContext(AUTHCONTEXT);

  const [isLoading, setIsLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const urlCheckTokenValidity = URLS.API_VERIFY_TOKEN
  const urlGetNewToken = URLS.API_REFRESH_TOKEN

  const { handlePost } = useFetch()

  const location = useLocation();
  const navigateToLogin = useNavigate();

  useEffect(()=>{

    const checkTokenValidity = async () => {
      try {
        // Checks whether the current token is valid
        const response = await handlePost(urlCheckTokenValidity, { token: token }, false);

        if (response.status === 200) {
          setIsAuthenticated(true);
        } 
        else if (response.status === 401) {
          // retrieving a new token from refresh token
          const responseGetNewToken = await handlePost(urlGetNewToken, { refresh: refresh }, false)
          if (responseGetNewToken.status === 200) {

            setIsReconnecting(true)
            setToken(responseGetNewToken.access);
            
            setTimeout(()=>{
              setIsReconnecting(false)
              navigateToLogin("/utilisateurs")
            }, [3000])


            // setRefresh(responseGetNewToken.refresh);

            // console.log("new access :", token , "new refresh :", refresh, "pathName: ", location.pathname);

            // if (responseGetNewToken.access === token){ console.log("token mis a jours avec success")} else {console.log("token mis a jours echouée")}
            
          } else if (responseGetNewToken.status === 401) {
            localStorage.removeItem("isAuth");
            localStorage.removeItem("refresh");
            localStorage.removeItem("token");
            navigateToLogin("/signIn")
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      checkTokenValidity();
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
    
  }, [location.pathname]);

  if (isReconnecting) {
    return <Preloader size={40} className={"bg-gray-50 h-screen"} description={"Reconnecting..."}/>;
  }
  if (!isAuth) {
    return <Navigate to="/signIn" />;
  }

  return <Outlet />;
};

