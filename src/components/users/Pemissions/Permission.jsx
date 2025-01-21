import React, { useState, useEffect } from 'react';
import { PermissionAction } from './ColumnsPermissions'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable'; 
import CreatePermission from './CreatePermission'; 
import Preloader from '../../Preloader';

export default function Permission() {

    const { showDialogPermission, columnsPermission } = PermissionAction();
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchPermissions = async () => {
        // const urlToShowAllUsers = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllPermissions = URLS.API_PERMISSION;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllPermissions);
            console.log("respoPermissions",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredPermissions = results?.map(item => {
                        const { perm_created_by, perm_updated_by, ...rest } = item;
                        return rest;
                        });
                        setPermissions(filteredPermissions);
                        // console.log("filtered Permissions", filteredPermissions);
                }
                else{
                    throw new Error('Erreur lors de la récupération des permissions');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchPermissions();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2'>Gestion des persmissions</h1>
    <div className='space-y-2 w-full'>
        <CreatePermission setOpen={setOpen} onSubmit={fetchPermissions}/>
        {columnsPermission && permissions?.length > 0 ? (
            <DataTable
                className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                columns={columnsPermission}
                data={permissions} 
            />
        ) : <Preloader size={40} />}
    </div>
    {showDialogPermission()}
</div> 
  );
};
