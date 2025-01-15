import { useContext } from 'react';
import UserEntryPoint from './users/UserEntryPoint';

import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
import Preloader from '../components/Preloader';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import '../App.css'; 
import { Button } from 'antd';
import { AUTHCONTEXT } from '../contexts/AuthProvider';
import { URLS } from '../../configUrl';
import { useFetch } from '../hooks/useFetch';
import EntityEntryPoint from './entity/EntityEntryPoint';


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

          if (response.status === 200) {
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
                      <h1 className="text-white text-3xl font-bold">Mes applications</h1>
                      <Button
                          type="submit"
                          className="absolute top-0 right-6 my-8 mx-4 w-auto bg-red-500 text-white py-2 px-4 text-xs rounded-3xl shadow-md hover:bg-blue-700 transition "
                          onClick={logout}
                      >
                        Se déconnecter
                      </Button>
                  </div>

                    <div className='flex flex-row space-x-1'>
                        {/* Ajoutez ici le reste de votre contenu */}
                        <EntityEntryPoint/>
                        <UserEntryPoint/>

                    </div>


                </div>
              
                {/* Footer */}
                <Footer className="flex justify-center text-white space-x-2 p-4 z-10" />
              </div>         
  );
};
