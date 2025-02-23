import { useContext, useState, useEffect } from 'react';
import UserEntryPoint from './users/UserEntryPoint';

import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import Preloader from '../components/Preloader';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaWeightHanging } from 'react-icons/fa';

import '../App.css'; 
import { Button } from 'antd';
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import { URLS } from '../../configUrl';
import { useFetch } from '../hooks/useFetch';
import EntityEntryPoint from './entity/EntityEntryPoint';
import IncidentEntryPoint from './incidents/IncidentEntryPoint';
import { ArrowLeftEndOnRectangleIcon  } from "@heroicons/react/24/outline";
import WPOEnteryPoint from './wpo/WPOEnteryPoint';
import VerifyPermission from '../utils/verifyPermission'
import { getEmployee } from '../utils/entity.utils';

export default function LuncherApp() {
  const { disconnect, refresh } = useContext(AUTHCONTEXT);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const navigateToLogin = useNavigate();

  const { handlePost } = useFetch();

  const logout = async () => {
    const urlToLogout = `${URLS.API_USER_ABILITY}/logout/`;

    const data = {
        refresh : refresh
    };

    try {
          const response = await handlePost(urlToLogout, data, false);

          if (response) {
            disconnect();
            navigateToLogin("/signIn");
          }
          else {
            toast.error(response.detail, { duration: 5000});
          }
          
        } catch (error) {
          // toast.error("Erreur lors de la déconnexion", { duration: 5000 });
        }
  };


  useEffect(()=>{
    const handleCheckPermissions = async () =>{
      try {
          let employee = await getEmployee();

          if(employee != null){
            let permissions = employee?.employeePermissions?.map(permission=>permission?.permission.permissionName);
            console.log(permissions);
            
            setUserPermissions(permissions || []);

            let roles = employee?.employeeRoles?.map(role => role?.role.roleName);
            setUserRoles(roles || []);
          }
      } catch (error) {
          console.log(error)
      }
    }
  handleCheckPermissions();
  }, []);



  //Cette page va representer la page présentante toutes les app de l'erp.

  return (
                <div className="flex flex-col min-h-screen container">
                {/* Effet nuageux avec animation */}
                <div className="absolute inset-0 opacity-30 blur-xl animate-gradient w-full h-full flex items-center justify-center">
                  <img src="/logo-placeholder.png" alt=""/>
                </div>

                {/* Contenu principal */}
                <div className="flex-grow relative z-10 p-8 w-full h-[80vh] md:px-[100px] overflow-hidden">

                  <div className='flex justify-between'>
                      <Button
                          type="submit"
                          className="transition-all  md:hover:w-[120px]  md:hover:h-[35px] absolute top-0 right-6 my-9 mx-4 w-auto bg-red-500 text-white px-2 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition "
                          onClick={logout}
                      >
                        <div className='hidden md:block'>Deconnexion</div>
                        <ArrowLeftEndOnRectangleIcon className="h-6 w-6 rotate-180" />
                      </Button>
                  </div>
                    <h1 className="text-xl md:text-3xl font-semibold font-poppins">Mes applications</h1>
                    <div className='flex flex-wrap space-x-5 justify-center items-start gap-2 xs:mt-[60px] mt-[100px] md:gap-5 w-full h-full overflow-y-auto'>
                        {/* Ajoutez ici le reste de votre contenu */}
                        <div className='flex justify-center items-start md:gap-4 flex-row flex-wrap mx-auto md:space-x-4'>
                          <VerifyPermission expected={["application__can_view_entities"]} functions={userPermissions} roles={userRoles}>
                            <EntityEntryPoint/>
                          </VerifyPermission>
                          <VerifyPermission  expected={["application__can_view_users"]} functions={userPermissions} roles={userRoles}>
                            <UserEntryPoint/>
                          </VerifyPermission>
                          <VerifyPermission expected={["application__can_view_incidents"]} functions={userPermissions} roles={userRoles}>
                            <IncidentEntryPoint/>
                          </VerifyPermission>
                          <VerifyPermission expected={["application__can_view_wpo"]} functions={userPermissions} roles={userRoles}>
                            <WPOEnteryPoint />
                          </VerifyPermission>
                        </div>
                    </div>


                </div>
              
                {/* Footer */}
                <Footer className="flex justify-center text-white space-x-2 p-4 z-10" />
              </div>         
  );
};
