import React, {useState} from 'react';
import Preloader from '../../components/Preloader';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Tabs from '../../components/common/Tabs'; 
import { links } from '../../utils/entity.path';
import EmployeeComponent from '../../components/entity/employee/Employee';

export default function Employee() {
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
                    {/* Employee */}
                    <div className='flex gap-2 items-center'>
                    <EmployeeComponent/>
                    </div>
                </div>
                <Footer className="flex py-1 my-[22px] space-x-2 justify-center"/>
            
            </>
        )
    }
</>
  );
};
