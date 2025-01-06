import Header from '../components/layout/Header';
import DashboardUser from '../components/users/DashboardUser';
import {Input} from "../components/ui/input";
import Footer from '../components/layout/Footer';
import { useState } from "react";
import Preloader from '../components/Preloader';


export default function Dashboard() {
  // const [isLoading, setIsLoading] =useState(false);
  return (
          
                <div className='m-4 space-y-8 items-center'>
                   <Header/>
                   
                     <Input className=" w-[300px] m-5 my-1"  placeholder="Rechercher..." />

                    <div className=' m-4'>
                      <DashboardUser/>
                    </div>

                    <Footer className=" m-4  mt-7 flex space-x-2 justify-center p-4"/>
                </div>

              
               
  );
};
