import { useState } from 'react';
import { FaIndustry } from 'react-icons/fa';
import Preloader from '../../components/Preloader';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
export default function EntityEntryPoint() {
    
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className='flex justify-normal md:justify-center flex-shrink md:items-center m-4'>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[100px] h-[100px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='flex flex-col items-center space-y-2'>
                                <a
                                    href="/entities"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center transition-all w-[70px] hover:w-[80px] h-[70px] hover:h-[80px] bg-gradient-to-tr from-secondary to-green-500 hover:bg-gradient-to-tr text-white rounded-xl shadow-sm hover:shadow-2xl hover:from-orange-600 hover:to-orange-400"
                                >
                                    <BuildingOffice2Icon className={"h-10 w-10 text-white"}/>
                                </a>
                                <p className='font-semibold text-xs text-center max-w-[70px]'>Gestion des entités</p>
                    </div>
                   
                )
            }

        </div>
    );
}