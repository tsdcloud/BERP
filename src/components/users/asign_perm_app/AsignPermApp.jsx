import React, { useState, useEffect } from 'react';
import { AsignPermAppAction } from './ColumnsAsignPermApp'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateAsignPermApp from './CreateAsignPermApp';
import Preloader from '../../Preloader';

export default function AsignPermApp() {

    const [asignPermApp, setAsignPermApp] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermApp = async () => {
        // const urlToShowAllAsignPermApp = URLS.API_ASIGN_PERM_APP;
        const urlToShowAllAsignPermApp = `${URLS.USER_API}/grant_permission_application/`;
        
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignPermApp);
            // console.log("respoasignPermApp",response);
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        // console.log("rest asign perm app", results);
                        const filteredAsignPermApp = results?.map(item => {
                            const { perm_assigned_by, ...rest } = item;
                            return {
                                id:rest.id,
                                id_permission:rest.permission.id,
                                id_app:rest.app.id,
                                permission_name: rest.permission.display_name,
                                description: rest.permission.description,
                                application_name: rest.app.application_name,
                                description_app: rest.app.description
                            };
                        });
                        // console.log("filtered asign perm role", filteredAsignPermApp);
                        setAsignPermApp(filteredAsignPermApp);
                        // console.log("asPR", asignPermApp);
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
        fetchAsignPermApp();
        
    }, []);

    const upDateTable = (id) => {
        setAsignPermApp((prevData) => prevData.filter((item) => item.id !== id));
    }

    const { showDialogAsignPermApp, columnsAsignPermApp } = AsignPermAppAction( { upDateTable: upDateTable } );


  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - Applications</h1>
    <div className='space-y-2 w-full'>
        <CreateAsignPermApp setOpen={setOpen} onSubmit={fetchAsignPermApp}/>
        {columnsAsignPermApp && asignPermApp?.length > 0 ? (
            <DataTable
                className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                columns={columnsAsignPermApp}
                data={asignPermApp} 
            />
        ) : isLoading ? <Preloader size={40} /> : <div className='flex  justify-center text-xl font-bold text-gray-300'> No data</div>}
    </div>
    {showDialogAsignPermApp()}
</div> 
  );
};

