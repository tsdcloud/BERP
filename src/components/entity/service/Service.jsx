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
        // const urlToShowAllService = URLS.API_SERVICE;
        const urlToShowAllService =  `${URLS.ENTITY_API}/services`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllService);
            // console.log("respo Service",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredService = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name,
                                     departmentId:rest.department.name,
                                     createdAt:rest.createdAt,
                                     isActive:rest.isActive,
                                    };

                        });
                        setServices(filteredService);
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
                    )}
                </div>
                {showDialogService()}
            </div>
  );
}
