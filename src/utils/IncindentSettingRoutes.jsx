import React, {useState, useEffect, useContext} from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getEmployee } from './entity.utils';
import Preloader from '../components/Preloader';
import Header from '../components/layout/Header';
import { PERMISSION_CONTEXT } from '../contexts/PermissionsProvider';
const IncidentSettingRoutes = ({permissions=[], roles=[]}) => {
    
    const { setPermissions, setRoles } = useContext(PERMISSION_CONTEXT)
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissions, setHasPermissions] = useState(false);
    const [hasRoles, setHasRoles] = useState(false);

    // Context

    useEffect(()=>{
        
        const handleCheckPermissions = async () =>{
            const employee = await getEmployee();
            if(!employee){
               setHasPermissions(false);
               setIsLoading(false);
               return 
            }
            const requiredPermissions = [...permissions];
            const userPermissions = employee?.employeePermissions.map(permission=>permission?.permission.permissionName) || [];
            setPermissions(userPermissions);
            
            const requiredRoles = [...roles];
            const userRoles = employee?.employeeRoles.map(role=>role?.role?.roleName) || [];
            setRoles(userRoles);

            const hasRequiredPermissions = requiredPermissions.some(permission => userPermissions.includes(permission));
            const hasRequiredRoles = requiredRoles.some(role => userRoles.includes(role));

            setHasPermissions(hasRequiredPermissions);
            setHasRoles(hasRequiredRoles);

            setIsLoading(false);
        }
        handleCheckPermissions();

        // const handleCheckPermissions = async () =>{
        //     try {
        //         let employee = await getEmployee();
      
        //         if(employee != null){
        //           let permissions = employee?.employeePermissions?.map(permission=>permission?.permission.permissionName);
        //           setPermissions(permissions || []);
        //           setUserPermissions(permissions || []);
      
        //           let roles = employee?.employeeRoles?.map(role => role?.role.roleName);
        //           setRoles(roles || []);
        //           setUserRoles(roles || []);
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        //   }
        //   handleCheckPermissions();
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
    
    // if (!hasPermissions && !hasRoles) {
    //     return <Navigate to="/incidents" />;
    // }

    return (
        <>
          <Outlet />
        </>
    )
}

export default IncidentSettingRoutes