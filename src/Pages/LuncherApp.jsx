import { useContext } from 'react';
import UserEntryPoint from './users/UserEntryPoint';

import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
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


export default function LuncherApp() {
  const { disconnect, refresh } = useContext(AUTHCONTEXT);
  const navigateToLogin = useNavigate();

  const { handlePost } = useFetch();

  const logout = async () => {
    const urlToLogout = URLS.LOGOUT;

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



  //Cette page va representer la page présentante toutes les app de l'erp.

  return (
                <div className="flex flex-col min-h-screen bg-primary">
                {/* Effet nuageux avec animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-60 blur-lg animate-gradient"></div>
              
                {/* Contenu principal */}
                <div className="flex-grow relative z-10 p-8">

                  <div className='flex justify-between'>
                      <h1 className="text-white text-xl md:text-3xl font-bold">Mes applications</h1>
                      <Button
                          type="submit"
                          className="absolute top-0 right-6 my-9 mx-4 w-auto bg-red-500 text-white px-2 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition "
                          onClick={logout}
                      >
                        <ArrowLeftEndOnRectangleIcon className="h-6 w-6 rotate-180" />
                      </Button>
                  </div>

                    <div className='m-3 flex flex-wrap space-x-1 justify-center items-center sm:justify-normal'>
                        {/* Ajoutez ici le reste de votre contenu */}
                        <EntityEntryPoint/>
                        <UserEntryPoint/>
                        <IncidentEntryPoint/>
                          <div className='flex justify-center items-center m-0 lg:m-4'>

                                <div className='m-9 flex flex-col items-center space-y-2'>
                                        <a
                                            href="https://dex.zukulufeg.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-[90px] h-[90px] bg-secondary text-white rounded-xl shadow-lg hover:bg-orange-600 transition duration-300"
                                        >
                                            <FaWeightHanging size={40} />
                                        </a>
                                        <p className='text-white text-xs'>WPO</p>
                              </div>
                              
                          </div>

                    </div>


                </div>
              
                {/* Footer */}
                <Footer className="flex justify-center text-white space-x-2 p-4 z-10" />
              </div>         
  );
};
