import React, { useState, useEffect } from 'react';
import { SiteAction } from './ColumnsSite';
import { useFetch } from '../../../hooks/useFetch'; 
import { URLS } from '../../../../configUrl'; 
import DataTable from '../../DataTable';
import CreateSite from './CreateSite';

export default function Site() {
    const [Site, setSite] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    const fetchSite = async () => {
        const urlToShowAllSite =  `${URLS.ENTITY_API}/sites`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllSite);
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredSite = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { id: rest.id, 
                                     name:rest.name,
                                     entityId:rest.entity.name,
                                     typeSite:rest.typeSite,
                                     createdAt:rest.createdAt,
                                     isActive:rest.isActive,
                                    };

                        });
                        setSite(filteredSite);
                }
                else{
                    throw new Error('Erreur lors de la récupération des sites');
                    
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchSite();
        
    }, []);

    const updateData = (id, updatedSite) => {
        setSite((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedSite } : item
            ));
            fetchSite();
    };

    const delSite = (id) => {
        setSite((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogSite, columnsSite } = SiteAction({ delSite, updateData });

  return (
    <div className='m-1 space-y-3 my-10 w-full'>
    <h1 className='text-sm mb-2 font-semibold'>Gestion des Sites</h1>
    <div className='space-y-2 w-full'>
        <CreateSite setOpen={setOpen} onSubmit={fetchSite}/>
        {columnsSite && Site?.length >= 0 && (
            <DataTable
               className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                columns={columnsSite}
                data={Site} 
            />
        )}
    </div>
    {showDialogSite()}
</div> 
  );
};

