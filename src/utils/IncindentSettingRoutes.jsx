import React, {useState, useEffect} from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const IncidentSettingRoutes = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(()=>{
        // const token = localStorage.getItem('token');
        // if (token || token != null) {
        //     const decodedToken = jwtDecode(token);
        //     const requiredPermissions = ['VIEW_INCIDENTS', 'EDIT_INCIDENTS'];
        //     const userPermissions = decodedToken.permissions || [];

        //     const hasRequiredPermissions = "incident__view_equipements";
        //     setHasPermissions(hasRequiredPermissions);
        // }

        // Get the user token 
        // Check if the token is valid
        // If token is valid, get user's employee profile, else redirect to the previous page
        // If the user token is valid set the user employee state to the gotten value
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

export default IncidentSettingRoutes