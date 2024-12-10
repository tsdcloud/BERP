import {useState} from 'react';
import illustrationHuman from "../../assets/illustrationHuman.svg";
import illustration from "../../assets/illustration.svg";
import Footer from './Footer';

export default function SignInLayout({children}) {

  document.title = "BERP - Business Enterprise Resource Planning";

  return (
    <div className='sm:bg-red-200 md:bg-transparent flex justify-between min-h-screen absolute w-full'>

        <div className='sm:bg-blue-200 md:bg-transparent flex flex-col justify-around ml-9'>
            <div className='sm:bg-pink-600 md:bg-transparent flex-col mt-9 space-y-1'>
                  <h3 className='font-medium mb-10'>BERP.</h3>
                  <h1 className='text-3xl font-bold'>Rapprochez-vous <br/>de l&apos;essentiel</h1>
                  <h4 className='text-xs'>Accéder à vos applications métiers dans un même endroit.</h4>   
            </div>
                <img src={illustrationHuman} className="mt-9 sm:bg-purple-400 md:bg-transparent w-[400px] h-[350px]" alt='Mascotte'/>
        </div>
        
        <div className='sm:bg-purple-500 md:bg-transparent relative'>
            <img src={illustration} className="sm:bg-red-400 md:bg-transparent bottom-10  w-[400px] h-[370px]" alt='water frame'/>
            
            <div className=' w-[360px] h-[370px] bg-white shadow-2xl relative bottom-[270px] right-[150px] rounded-sm '>
             
              <div className='text-center py-3'>

                  <h3 className='font-semibold text-xs'>Connectez-vous à votre compte</h3>
                  <p className='text-xs'>Renseignez correctement vos identifiants.</p>
              </div>
              <div className='text-center'>
                  {children}
              </div>
            </div>
            <div className='sm:bg-pink-500 md:bg-transparent relative bottom-[210px] right-[170px]'>
              <Footer/>
            </div>
            
       
        </div>
      
    </div>
  );
};
