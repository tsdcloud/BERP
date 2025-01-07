import Header from '../components/layout/Header';
import UserEntryPoint from '../components/users/UserEntryPoint';
import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
import Preloader from '../components/Preloader';


export default function LuncherApp() {
  // const [isLoading, setIsLoading] = useState(false);

  //Cette page va representer la page présentante toutes les app de l'erp.

  return (
          
                <div className='m-4 space-y-8 items-center'>
                   <Header/>
                   
                     <Input className=" w-[300px] m-5 my-1"  placeholder="Rechercher..." />

                    <div className=' m-4'>
                      <UserEntryPoint/>
                    </div>

                    <Footer className=" m-4  mt-7 flex space-x-2 justify-center p-4"/>
                </div>

              
               
  );
};
