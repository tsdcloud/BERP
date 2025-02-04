import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ApplicationAction } from './ColumnsApplication';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateApplication from './CreateApplication';

export default function Application() {
    const { showDialogApplication, columnsApplication } = ApplicationAction();
    const [Applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchApplication = async () => {
        const urlToShowAllApp = URLS.API_APPLICATION_ENTITY;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllApp);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredApp = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        console.log("appp",filteredApp);
                        return rest;
                        });
                        setApplications(filteredApp);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Applications');
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
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Applications de l'entité</h1>
                <div className='space-y-2'>
                    <CreateApplication setOpen={setOpen} onSubmit={fetchApplication} />
                    { columnsApplication && Applications?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsApplication}
                            data={Applications} 
                        />
                    )}
                </div>
                {showDialogApplication()}
            </div>
  );
}
