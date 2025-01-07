import { useState } from 'react';
import { FaMobileAlt } from 'react-icons/fa';
import Preloader from '../../components/Preloader';


//c'est ici que je vais gérer le tabs, toutes les instances de User.
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
                    <div className='flex flex-col items-center m-3 space-y-2'>
                            <div className="flex flex-col items-center justify-center bg-gray-100 w-[150px] h-[150px] rounded-sm">
                            
                                <a
                                    href="/utilisateurs" // Remplacez par le chemin réel de votre page
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-[70px] h-[70px] bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                                >
                                    <FaMobileAlt size={40} />
                                </a>
                            </div>
                                <p className='text-white text-sm'>Gestion des utilisateurs</p>
                    </div>
                )
            }

        </div>
    );
}