import React, { useState, useEffect } from 'react';
import { AsignPermRoleAction } from './ColumnsAsignPermRole'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable'; 
import CreateAsignPermRole from './CreateAsignPermRole'; 
import Preloader from '../../Preloader';

export default function AsignPermRole() {

    const [asignPermRole, setAsignPermRole] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermRole = async () => {
        // const urlToShowAllAsignPermRole = URLS.API_ASIGN_PERM_ROLE;
        const urlToShowAllAsignPermRole = `${URLS.USER_API}/grant_permission_role/`;
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
                                permission_name: rest.permission.display_name,
                                description: rest.permission.description,
                                role_name: rest.role.display_name,
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

    const upDateTable = (id) => {
        setAsignPermRole((prevData) => prevData.filter((item) => item.id !== id));
    }

    const { showDialogAsignPermRole, columnsAsignPermRole } = AsignPermRoleAction( { upDateTable: upDateTable } );

    useEffect(() => {
        fetchAsignPermRole();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - Rôles</h1>
    <div className='space-y-2 w-full'>
        <CreateAsignPermRole setOpen={setOpen} onSubmit={fetchAsignPermRole}/>
        {columnsAsignPermRole && asignPermRole?.length > 0 ? (
            <DataTable
                className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                columns={columnsAsignPermRole}
                data={asignPermRole} 
            />
        ) : isLoading ? <Preloader size={40} /> : <div className='flex  justify-center text-xl font-bold text-gray-300'> No data</div>}
    </div>
    {showDialogAsignPermRole()}
</div> 
  );
};

