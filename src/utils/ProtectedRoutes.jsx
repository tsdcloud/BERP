import React, {useState, useEffect} from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoutes = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const requiredPermissions = ['VIEW_INCIDENTS', 'EDIT_INCIDENTS'];
            const userPermissions = decodedToken.permissions || [];

            const hasRequiredPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
            setHasPermissions(hasRequiredPermissions);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
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

export default ProtectedRoutes