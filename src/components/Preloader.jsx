import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Preloader({className, size}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
        <DotLottieReact
            src="https://lottie.host/80be41f0-ec94-4a79-a911-66bad6fb3a71/uXY6gUFaeL.lottie"
            loop
            autoplay
            style={{
              width: size,
              height: size,
            }}
        />
    </div>
  );
}

export default Preloader;
