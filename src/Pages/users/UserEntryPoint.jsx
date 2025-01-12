import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Preloader from '../../components/Preloader';
export default function UserEntryPoint() {
    
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className='flex sm:justify-normal justify-center sm:items-start items-center m-0 lg:m-4 mb-7'>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[100px] h-[100px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='flex flex-col items-center m-7 space-y-2'>
                        <a
                            href="/utilisateurs" // Remplacez par le chemin réel de votre page
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-[90px] h-[90px] bg-secondary text-white rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
                        >
                            <FaUser size={40} />
                        </a>
                        <p className='text-white text-xs'>Gestion des utilisateurs</p>
                    </div>
                )
            }

        </div>
    );
}