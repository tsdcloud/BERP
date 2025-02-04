import { useState } from 'react';
import { FaIndustry } from 'react-icons/fa';
import Preloader from '../../components/Preloader';
export default function EntityEntryPoint() {
    
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
                                    href="/entities"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-[90px] h-[90px] bg-secondary text-white rounded-xl shadow-lg hover:bg-orange-600 transition duration-300"
                                >
                                    <FaIndustry size={40} />
                                </a>
                                <p className='text-white text-xs'>Gestion des entités</p>
                    </div>
                   
                )
            }

        </div>
    );
}