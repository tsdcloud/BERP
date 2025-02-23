import { useState, useEffect } from 'react';
import CreateEntity from './CreateEntity';
import DataTable from '../DataTable';
import { EntityAction } from './ColumnsEntity';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl'; 

export default function Entity() {
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEntities = async () => {
        const urlToShowAllEntities =  `${URLS.ENTITY_API}/entities`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEntities);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEntities = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id,
                                 name:rest.name,
                                 localisation : rest.localisation,
                                 townId:rest.towns.name,
                                 phone : rest.phone,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        setEntities(filteredEntities);
                }
                else{
                    throw new Error('Erreur lors de la récupération des entités');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEntities();
        
    }, []);

    const updateData = (id, updatedEntity) => {
        setEntities((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedEntity } : item
            )
        );
        fetchEntities();
    };

    const delEntity = (id) => {
        setEntities((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogEntity, columnsEntity } = EntityAction({ delEntity, updateData });

  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des entités</h1>
                <div className='space-y-2 w-full'>
                    <CreateEntity setOpen={setOpen} onSubmit={fetchEntities} />
                    {columnsEntity && entities.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsEntity}
                            data={entities} 
                        />
                    )}
                </div>
                {showDialogEntity()}
            </div>
  );
}
