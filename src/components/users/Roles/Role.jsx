import React, { useState, useEffect } from 'react';
import { RoleAction } from './ColumnsRole'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable'; 
import CreateRole from './CreateRole'; 

export default function Role() {

    const { showDialogRole, columnsRole } = RoleAction();
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchRole = async () => {
        const urlToShowAllRole = URLS.API_ROLE;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllRole);
            console.log("respoRoles",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredRole = results?.map(item => {
                        const { role_created_by, role_updated_by, ...rest } = item;
                        return rest;
                        });
                        setRoles(filteredRole);
                }
                else{
                    throw new Error('Erreur lors de la récupération des rôles');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchRole();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des rôles</h1>
    <div className='space-y-2'>
        <CreateRole setOpen={setOpen} onSubmit={fetchRole}/>
        {columnsRole && roles?.length >= 0 && (
            <DataTable
                className="rounded-md border w-[800px] text-xs"
                columns={columnsRole}
                data={roles} 
            />
        )}
    </div>
    {showDialogRole()}
</div> 
  );
};

