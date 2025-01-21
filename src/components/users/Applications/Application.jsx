import React, { useState, useEffect } from 'react';
import { ApplicationAction } from './ColumnsApplication'; 
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable'; 
import CreateApplication from './CreateApplication'; 

import Preloader from '../../Preloader';

export default function Application() {

    const { showDialogApplication, columnsApplication } = ApplicationAction();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchApplication = async () => {
        const urlToShowAllApplication = URLS.API_APPLICATION;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllApplication);
            // console.log("respoApp",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredApplication = results?.map(item => {
                        const { app_created_by, app_updated_by, ...rest } = item;
                        return rest;
                        });
                        setApplications(filteredApplication);
                }
                else{
                    throw new Error('Erreur lors de la récupération des applications');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchApplication();
    }, []);

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
        <h1 className='text-sm mb-2'>Gestion des applications</h1>
        <div className='space-y-2 w-full'>
            <CreateApplication setOpen={setOpen} onSubmit={fetchApplication}/>
            {columnsApplication && applications?.length > 0 ? (
                <DataTable
                    className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                    columns={columnsApplication}
                    data={applications} 
                />
            ) : <Preloader size={40} />} 
        </div>
        {showDialogApplication()}
    </div> 
  );
};

