import Header from '../components/layout/Header';
import DashboardUser from '../components/users/DashboardUser';
import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
import Preloader from '../components/Preloader';


export default function Dashboard() {
  // const [isLoading, setIsLoading] =useState(false);
  return (
        <>
         
                {/* <div className='flex justify-center'>
                  <Preloader className="w-[200px] h-[200px]"/>
                  <h6>Chargement...</h6>
                </div> */}

              
                <>
                  <Header/>
                    <div className='m-6 flex justify-end'>
                        <Input className=" w-[300px]" 
                          placeholder="Rechercher..." />
                      
                    </div>
                    <div className='m-6'>
                      <DashboardUser/>
                    </div>
                    <Footer className="flex space-x-2 justify-center p-2"/>
                </>
             
        </>
  );
}
