import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { ServiceAction } from './ColumnsService';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateService from './CreateService';

export default function Service() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchService = async () => {
        const urlToShowAllService =  `${URLS.ENTITY_API}/services`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllService);
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

    const updateData = (id, updatedCountry) => {
        setServices((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedCountry } : item
            ));
            fetchService();
    };

    const delService = (id) => {
        setServices((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogService, columnsService } = ServiceAction({ delService, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des services</h1>
                <div className='space-y-2 w-full'>
                    <CreateService setOpen={setOpen} onSubmit={fetchService} />
                    {columnsService && services.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsService}
                            data={services} 
                        />
                    )}
                </div>
                {showDialogService()}
            </div>
  );
}
