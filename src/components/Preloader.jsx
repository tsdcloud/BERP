import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Preloader({className}) {
  return (
    <div className={className}>
        <DotLottieReact
            src="https://lottie.host/80be41f0-ec94-4a79-a911-66bad6fb3a71/uXY6gUFaeL.lottie"
            loop
            autoplay
        />
    </div>
  );
}

export default Preloader;
