import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ServiceAction } from './ColumnsService';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateService from './CreateService';

export default function Service() {
    const { showDialogService, columnsService } = ServiceAction();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchService = async () => {
        // const urlToShowAllServices = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllServices = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllServices);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredEntity = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("services", filteredEntity);
                        setServices(filteredEntity);
                }
                else{
                    throw new Error('Erreur lors de la récupération des services');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchService();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des services</h1>
                <div className='space-y-2'>
                    <CreateService setOpen={setOpen} onSubmit={fetchService} />
                    {columnsService && services.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsService}
                            data={services} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogService()}
            </div>
  );
}
