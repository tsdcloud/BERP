import Header from '../components/layout/Header';
import UserEntryPoint from './users/UserEntryPoint';
import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
import Preloader from '../components/Preloader';

import React from 'react';
import '../App.css'; 


export default function LuncherApp() {
  // const [isLoading, setIsLoading] = useState(false);

  //Cette page va representer la page présentante toutes les app de l'erp.

  return (
          
                // <div className='m-4 space-y-8 items-center'>
                //    {/* <Header/> */}
                   
                //      {/* <Input className=" w-[300px] m-5 my-1"  placeholder="Rechercher..." /> */}

                //     <div className=' m-4'>
                //       <UserEntryPoint/>
                //     </div>

                //     {/* <Footer className=" m-4  mt-7 flex space-x-2 justify-center p-4"/> */}
                // </div>
                <div className="flex flex-col min-h-screen bg-primary">
                {/* Effet nuageux avec animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-60 blur-lg animate-gradient"></div>
              
                {/* Contenu principal */}
                <div className="flex-grow relative z-10 p-8">
                  <h1 className="text-white text-3xl font-bold">Vos applications</h1>
                  {/* Ajoutez ici le reste de votre contenu */}
                  <UserEntryPoint/>
                </div>
              
                {/* Footer */}
                <Footer className="flex justify-center text-white space-x-2 p-4 z-10" />
              </div>

              
               
  );
};
