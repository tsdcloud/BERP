import React, { useState, useEffect } from 'react';
import { AsignPermUserAction } from './ColumnsAsignPermUser';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateAsignPermUser from './CreateAsignPermUser';

export default function AsignPermUser() {

    const { showDialogAsignPermUser, columnsAsignPermUser } = AsignPermUserAction();
    const [asignPermUser, setAsignPermUser] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermUser = async () => {
        const urlToShowAllAsignPermUser = URLS.API_ASIGN_PERM_USER;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignPermUser);
            console.log("respoasignPermUser",response);
                if (response.success && response?.data?.results) {
                        const results = response?.data?.results;
                        console.log("rest asign perm user", results);
                        const filteredAsignPermUser = results?.map(item => {
                            const { perm_assigned_by, date_assigned,  ...rest } = item;
                            return {
                                id:rest.id,
                                id_permission:rest.permission.id,
                                id_user:rest.user.id,
                                permission_name: rest.permission.display_name,
                                description: rest.permission.description,
                                first_name: rest.user.first_name,
                                username: rest.user.username
                            };
                        });
                        // console.log("filtered asign perm role", filteredAsignPermUser);
                        setAsignPermUser(filteredAsignPermUser);
                        // console.log("asPR", asignPermUser);
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
        fetchAsignPermUser();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - utilisateurs</h1>
    <div className='space-y-2'>
        <CreateAsignPermUser setOpen={setOpen} onSubmit={fetchAsignPermUser}/>
        {columnsAsignPermUser && asignPermUser?.length > 0 && (
            <DataTable
                className="rounded-md border w-[850px] text-xs"
                columns={columnsAsignPermUser}
                data={asignPermUser} 
            />
        )}
    </div>
    {showDialogAsignPermUser()}
</div> 
  );
};

