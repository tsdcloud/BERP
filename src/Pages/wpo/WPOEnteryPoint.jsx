import { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import Preloader from '../../components/Preloader';
import { TruckIcon } from '@heroicons/react/24/solid';
import { URLS } from '../../../configUrl';

const WPOEnteryPoint = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

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
                                    href={`${URLS.WPO_LINK}/?token=${token}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-[90px] h-[90px] bg-secondary text-white rounded-xl shadow-lg hover:bg-orange-600 transition duration-300"
                                >
                                    <TruckIcon className='h-8' />
                                </a>
                                <p className='text-white text-xs'>WPO</p>
                    </div>
                )
            }

        </div>
    );
}

export default WPOEnteryPoint