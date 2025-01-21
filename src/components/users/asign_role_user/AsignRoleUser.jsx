import React, { useState, useEffect } from 'react';
import { AsignRoleUserAction } from './ColumnsAsignRoleUser';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateAsignRoleUser from './CreateAsignRoleUser';
import Preloader from '../../Preloader';

export default function AsignRoleUser() {

    const { showDialogAsignRoleUser, columnsAsignRoleUser } = AsignRoleUserAction();
    const [asignRoleUser, setAsignRoleUser] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignRoleUser = async () => {
        const urlToShowAllAsignRoleUser = URLS.API_ASIGN_ROLE_USER;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignRoleUser);
            console.log("respoasignRoleUser",response);
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        console.log("rest asign role user", results);
                        const filteredAsignRoleUser = results?.map(item => {
                            const { role_assigned_by, date_assigned,  ...rest } = item;
                            return {
                                id:rest.id,
                                id_role:rest.role.id,
                                id_user:rest.user.id,
                                role_name: rest.role.display_name,
                                description: rest.role.description,
                                first_name: rest.user.first_name,
                                username: rest.user.username
                            };
                        });
                        // console.log("filtered asign perm role", filteredAsignRoleUser);
                        setAsignRoleUser(filteredAsignRoleUser);
                        // console.log("asPR", asignRoleUser);
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
        fetchAsignRoleUser();
        
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2'>Gestion des asignations Rôles - utilisateurs</h1>
    <div className='space-y-2 w-full'>
        <CreateAsignRoleUser setOpen={setOpen} onSubmit={fetchAsignRoleUser}/>
        {columnsAsignRoleUser && asignRoleUser?.length > 0 ? (
            <DataTable
                className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                columns={columnsAsignRoleUser}
                data={asignRoleUser} 
            />
        ) : <Preloader size={40} />}
    </div>
    {showDialogAsignRoleUser()}
</div> 
  );
};

