//protected route
import { useEffect, useContext, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import { URLS } from '../../configUrl';
import { useFetch } from './useFetch';
import Preloader from '../components/Preloader';
import { usePermissions } from '../contexts/PermissionsProvider';
import { getEmployee } from '../utils/entity.utils';

export default function ProtectedRoutes() {
  const { token, setToken, refresh, setRefresh, isAuth } = useContext(AUTHCONTEXT);

  const [isLoading, setIsLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const urlCheckTokenValidity = `${URLS.CHECK_TOKEN_API}/verify/`;
  const urlGetNewToken = `${URLS.CHECK_TOKEN_API}/refresh/`;

  const { handlePost, handleFetch } = useFetch();

  const location = useLocation();
  const navigateTo = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  const { roles, permissions, setRoles, setPermissions} = usePermissions();
  useEffect(()=>{
    // Fetch permissions and roles
    const fetchPermissionsAndRoles = async () => {
      try {
        setIsLoading(true);
        const employee = await getEmployee();
        if(!employee){
            setIsLoading(false);
            return 
        }
        const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
        const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
        
        let empPerms = employeePermissions?.employeePermissions
        let empRoles = employeeRoles?.employeeRoles

        let formatedRoles = empRoles.map(role=>role?.role.roleName)
        let formatedPerms = empPerms.map(perm=>perm?.permission.permissionName)

        setRoles(formatedRoles);
        setPermissions(formatedPerms);
      } catch (error) {
        console.error("Error during fetch permissions and roles",error);
      }finally{
        setIsLoading(false);
      }
    }

    if(!roles && !permissions){
      fetchPermissionsAndRoles();
    }else{
      setIsLoading(false);
    }

  }, []);
  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    if (tokenFromQuery) {
      const verifyTokenFromQuery = async () => {
        try {
          const urlToLogin = `${URLS.API_USER_ABILITY}/login/?token=${tokenFromQuery}`;
          const response = await handleFetch(urlToLogin);
          if (response.status === 200) {
            let result = response.json();
            localStorage.setItem("token", result.token)
            setToken(tokenFromQuery);
            setIsAuthenticated(true);
            setSearchParams({});
          } else {
            console.error("Invalid token from query params");
            setSearchParams({});
          }
        } catch (error) {
          console.error("Error verifying token from query params:", error);
          setSearchParams({});
        }
      };
      verifyTokenFromQuery();
    }
  }, [searchParams]);

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
          const responseGetNewToken = await handlePost(urlGetNewToken, { refresh: refresh }, false);
          if (responseGetNewToken.status === 200) {

            setIsReconnecting(true);
            setToken(responseGetNewToken.access);
            
            setTimeout(()=>{
              setIsReconnecting(false);
              navigateTo(`${location.pathname}`); 
            }, [3000]);

          } else if (responseGetNewToken.status === 401) {
            localStorage.removeItem("isAuth");
            localStorage.removeItem("refresh");
            localStorage.removeItem("token");
            navigateTo("/signIn");
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

  if(isLoading) return <Preloader size={40} className={"bg-gray-50 h-screen"} description={"Reconnecting..."}/>;

  if (isReconnecting) {
    return <Preloader size={40} className={"bg-gray-50 h-screen"} description={"Reconnecting..."}/>;
  }

  if (!isAuth) {
    return <Navigate to="/signIn" />;
  }

  return <Outlet />;
};

