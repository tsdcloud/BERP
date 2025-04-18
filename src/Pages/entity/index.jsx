import {useState} from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Tabs from '../../components/common/Tabs';
import { links } from '../../utils/entity.path';
import Entity from '../../components/entity/Entity';
import Preloader from '../../components/Preloader';


export default function Index () {
    const [isLoading, setIsLoading] = useState(false);
  return (
    <>
    {
        isLoading ? (
            <div className='flex flex-col justify-center items-center'>
                <Preloader className="w-[100px] h-[100px]"/>
                <h6>Chargement...</h6>
            </div>
        ) : (
            <>
                <Header />
                <div className='flex flex-col px-6 '>
                    <div>
                        <Tabs links={links} />
                    </div>
                    {/* users */}
                    <div className='flex gap-2 items-center'>
                     <Entity/>
                    </div>
                </div>
                <Footer className="flex flex-col sm:flex-row items-center justify-center"/>
            
            </>
        )
    }
</>
  );
};
