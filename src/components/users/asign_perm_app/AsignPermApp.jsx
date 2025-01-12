import React, { useState, useEffect } from 'react';
import { AsignPermAppAction } from './ColumnsAsignPermApp'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateAsignPermApp from './CreateAsignPermApp';

export default function AsignPermApp() {

    const { showDialogAsignPermApp, columnsAsignPermApp } = AsignPermAppAction();
    const [asignPermApp, setAsignPermApp] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAsignPermApp = async () => {
        const urlToShowAllAsignPermApp = URLS.API_ASIGN_PERM_APP;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllAsignPermApp);
            console.log("respoasignPermApp",response);
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        console.log("rest asign perm app", results);
                        const filteredAsignPermApp = results?.map(item => {
                            const { perm_assigned_by, ...rest } = item;
                            return {
                                id:rest.id,
                                id_permission:rest.permission.id,
                                id_app:rest.app.id,
                                permission_name: rest.permission.permission_name,
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

  return (
    <div className='m-1 space-y-3 my-10 '>
    <h1 className='text-sm mb-2'>Gestion des asignations Permissions - Applications</h1>
    <div className='space-y-2'>
        <CreateAsignPermApp setOpen={setOpen} onSubmit={fetchAsignPermApp}/>
        {columnsAsignPermApp && asignPermApp?.length > 0 && (
            <DataTable
                className="rounded-md border w-[850px] text-xs"
                columns={columnsAsignPermApp}
                data={asignPermApp} 
            />
        )}
    </div>
    {showDialogAsignPermApp()}
</div> 
  );
};

