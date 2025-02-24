import React, { useState, useEffect } from 'react';
import { AsignPermUserAction } from './ColumnsAsignPermUser';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateAsignPermUser from './CreateAsignPermUser';
import Preloader from '../../Preloader';

export default function AsignPermUser() {

    const [asignPermUser, setAsignPermUser] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermUser = async () => {
        // const urlToShowAllAsignPermUser = URLS.API_ASIGN_PERM_USER;
        const urlToShowAllAsignPermUser = `${URLS.USER_API}/grant_permission_user/`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignPermUser);
            // console.log("respoasignPermUser",response);
                if (response.success && response?.data?.results) {
                        const results = response?.data?.results;
                        // console.log("rest asign perm user", results);
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

    const upDateTable = (id) => {
        setAsignPermUser((prevData) => prevData.filter((item) => item.id !== id));
    }

    const { showDialogAsignPermUser, columnsAsignPermUser } = AsignPermUserAction( { upDateTable: upDateTable } );

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - utilisateurs</h1>
    <div className='space-y-2 w-full'>
        <CreateAsignPermUser setOpen={setOpen} onSubmit={fetchAsignPermUser}/>
        {columnsAsignPermUser && asignPermUser?.length > 0 ? (
            <DataTable
                className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                columns={columnsAsignPermUser}
                data={asignPermUser} 
            />
        ) : isLoading ? <Preloader size={40} /> : <div className='flex  justify-center text-xl font-bold text-gray-300'> No data</div>}
    </div>
    {showDialogAsignPermUser()}
</div> 
  );
};

