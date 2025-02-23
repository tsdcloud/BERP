import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ApplicationAction } from './ColumnsApplication';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateApplication from './CreateApplication';

export default function Application() {
    const [Applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchApplication = async () => {
        // const urlToShowAllApp = URLS.API_APPLICATION_ENTITY;
        const urlToShowAllApp =  `${URLS.ENTITY_API}/applications`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllApp);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("Res App", results);
                        const filteredApp = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                         });
                        //  console.log("appp",filteredApp);
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

    const updateData = (id, updatedApplication) => {
        setApplications((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedApplication } : item
            )
        );
    };

    const delApp = (id) => {
        setApplications((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogApplication, columnsApplication } = ApplicationAction({ updateData, delApp });

  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Applications de l'entité</h1>
                <div className='space-y-2 w-full'>
                    <CreateApplication setOpen={setOpen} onSubmit={fetchApplication} />
                    { columnsApplication && Applications?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                            columns={columnsApplication}
                            data={Applications} 
                        />
                    )}
                </div>
                {showDialogApplication()}
            </div>
  );
}
