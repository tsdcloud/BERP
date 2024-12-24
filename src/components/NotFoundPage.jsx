import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center"> 
    <div className='flex justify-center flex-col items-center'>
        <DotLottieReact
            className='w-[700px]'
            src="https://lottie.host/d3dee401-34ba-41b3-8947-8cc11db4443b/uvl2OErSCZ.lottie"
            loop
            autoplay />
        <div className='w-[700px] items-center text-center mt-5'>
            <h1 className='font-bold text-2xl mb-1'>Page non trouvée.</h1>
            <p className='text-sm'>Nous n'avons pas trouvé le chemin de votre requête.</p>
            <Link className="underline text-green-700" to="/">Revenir à l'accueil.</Link>
        </div>
    </div>
</div>
  );
}

export default NotFoundPage;
