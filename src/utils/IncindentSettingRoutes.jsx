import React, {useState, useEffect} from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getEmployee } from './entity.utils';
import Preloader from '../components/Preloader';
import Header from '../components/layout/Header';

const IncidentSettingRoutes = ({permissions}) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(()=>{
        
        const handleCheckPermissions = async () =>{
            const employee = await getEmployee();
            console.log(employee)
            if(!employee){
               setHasPermissions(false);
               setIsLoading(false);
               return 
            }
            const requiredPermissions = [...permissions];
            const userPermissions = employee?.employeePermissions.map(permission=>permission?.permission.permissionName) || [];
            console.log(userPermissions)
            const hasRequiredPermissions = requiredPermissions.some(permission => userPermissions.includes(permission));
            setHasPermissions(hasRequiredPermissions);
            setIsLoading(false);
        }
        handleCheckPermissions();
    }, []);

    if (isLoading) {
        return (
        <>
            <Header />
            <div className='px-6 h-full w-full flex items-center justify-center'>
                <div className='w-[100px] h-[100px]'>
                    <Preloader />
                </div>
            </div>
        </>
        );
    }
    
    if (!hasPermissions) {
        return <Navigate to="/incidents" />;
    }

    return (
        <>
          <Outlet />
        </>
    )
}

export default IncidentSettingRoutes