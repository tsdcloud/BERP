import {useState} from 'react';
import illustrationHuman from "../../assets/illustrationHuman.svg";
import illustration from "../../assets/illustration.svg";
import Footer from './Footer';

export default function SignInLayout({children}) {

  document.title = "BERP - Business Enterprise Resource Planning";

  return (
    
    <div className='md:bg-transparent flex justify-between items-center h-screen min-h-screen relative w-full overflow-hidden'>
        <img src={illustration} className=" md:bg-transparent top-0 -right-10  w-[400px] h-[370px] absolute -z-10" alt='water frame'/>
        <img src={illustration} className=" md:bg-transparent -bottom-10 -left-10 rotate-180  w-[400px] h-[370px] absolute -z-10" alt='water frame'/>
        
        <div className='flex flex-col lg:flex-row h-full w-full items-center justify-center lg:items-center sm:justify-center lg:justify-evenly lg:mt-0'>
          <div className='flex flex-col mx-4 md:mx-0 md:gap-2 my-6'>
              <h3 className='font-medium md:mb-10 text-lg font-mono absolute z-50 top-6 left-3 md:relative'>BERP.</h3>
              <h1 className='text-4xl lg:text-6xl font-bold hidden md:block'>Rapprochez-vous <br/>de l&apos;essentiel.</h1>
              <h4 className='lg:text-md hidden md:block'>Accéder à vos applications métiers dans un même endroit.</h4>
          </div>
          
          <div className=' w-[360px] md:w-[500px] h-[370px] md:h-[500px] bg-white shadow-2xl relative rounded-sm md:m-0 px-4'>
            <div className='md:bg-transparent p-5 m-0'>
                {children}
            </div>
          </div>
        </div>
      
    </div>
  );
};
