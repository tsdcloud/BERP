import { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import Preloader from '../../components/Preloader';
import { TruckIcon } from '@heroicons/react/24/outline';
import { URLS } from '../../../configUrl';

const WPOEnteryPoint = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    return (
        <div className='flex justify-normal md:justify-center items-start md:items-center m-4'>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[100px] h-[100px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='flex flex-col items-center space-y-2'>
                                <a
                                    href={`${URLS.WPO_LINK}/?token=${token}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center transition-all w-[70px] hover:w-[80px] h-[70px] hover:h-[80px] bg-gradient-to-tr from-secondary to-green-500 hover:bg-gradient-to-tr text-white rounded-xl shadow-sm hover:shadow-2xl hover:from-orange-600 hover:to-orange-400"
                                >
                                    <TruckIcon className='h-10 w-10' />
                                </a>
                                <p className='font-semibold text-xs text-center max-w-[70px]'>WPO</p>
                    </div>
                )
            }

        </div>
    );
}

export default WPOEnteryPoint