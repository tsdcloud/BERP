import React, { useState, useEffect } from 'react';
import { AsignPermRoleAction } from './ColumnsAsignPermRole'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable'; 
import CreateAsignPermRole from './CreateAsignPermRole'; 

export default function AsignPermRole() {

    const { showDialogAsignPermRole, columnsAsignPermRole } = AsignPermRoleAction();
    const [asignPermRole, setAsignPermRole] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermRole = async () => {
        const urlToShowAllAsignPermRole = URLS.API_ASIGN_PERM_ROLE;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignPermRole);
            // console.log("respoasignPermRole",response);
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        // console.log("rest asign perm role", results);
                        const filteredAsignPermRole = results?.map(item => {
                            const { perm_assigned_by, ...rest } = item;
                            return {
                                id:rest.id,
                                id_permission:rest.permission.id,
                                id_role:rest.role.id,
                                permission_name: rest.permission.permission_name,
                                description: rest.permission.description,
                                role_name: rest.role.role_name,
                                description_role: rest.role.description
                            };
                        });
                        // console.log("filtered asign perm role", filteredAsignPermRole);
                        setAsignPermRole(filteredAsignPermRole);
                        // console.log("asPR", asignPermRole);
                }
                else{
                    throw new Error('Erreur lors de la récupération des asignations');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchAsignPermRole();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - Rôles</h1>
    <div className='space-y-2'>
        <CreateAsignPermRole setOpen={setOpen} onSubmit={fetchAsignPermRole}/>
        {columnsAsignPermRole && asignPermRole?.length > 0 && (
            <DataTable
                className="rounded-md border w-[850px] text-xs"
                columns={columnsAsignPermRole}
                data={asignPermRole} 
            />
        )}
    </div>
    {showDialogAsignPermRole()}
</div> 
  );
};

