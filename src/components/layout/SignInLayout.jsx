import {useState} from 'react';
import illustrationHuman from "../../assets/illustrationHuman.svg";
import illustration from "../../assets/illustration.svg";
import Footer from './Footer';

export default function SignInLayout({children}) {

  document.title = "BERP - Business Enterprise Resource Planning";

  return (
    
    <div className='sm:bg-red-200 md:bg-transparent flex justify-between items-center h-screen min-h-screen relative w-full overflow-hidden'>
        <img src={illustration} className="sm:bg-red-400 md:bg-transparent top-0 -right-10  w-[400px] h-[370px] absolute -z-10" alt='water frame'/>
        <div className='flex h-full w-full'>

              <div className='hidden sm:block md:w-1/2 h-full flex flex-col justify-between ml-9 p-8'>
                <div className='sm:bg-pink-600 md:bg-transparent flex-col mt-9 space-y-1'>
                        <h3 className='font-medium mb-10'>BERP.</h3>
                        <h1 className='text-3xl font-bold'>Rapprochez-vous <br/>de l&apos;essentiel.</h1>
                        <h4 className='text-xs'>Accéder à vos applications métiers dans un même endroit.</h4>   
                </div>
                <img src={illustrationHuman} className="mt-9 sm:bg-purple-400 md:bg-transparent w-[400px] h-[350px]" alt='Mascotte'/>
              </div>


              <div className='h-full flex flex-col space-y-8 items-center mt-[100px]'>
                    <div className=' w-[360px] h-[370px] bg-white shadow-2xl relative rounded-sm '>
                    
                      
                      <div className=' sm:bg-blue-400 md:bg-transparent p-5 m-0'>
                          {children}
                      </div>
                    </div>
                    <div className='sm:bg-pink-500 md:bg-transparent relative'>
                      <Footer className="text-center"/>
                    </div>
              </div>
        </div>
      
    </div>
  );
};
