import { useState, useEffect } from 'react';
import CreateEntity from './CreateEntity';
import DataTable from '../DataTable';
import { EntityAction } from './ColumnsEntity';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl'; 

export default function Entity() {
    const { showDialogEntity, columnsEntity } = EntityAction();
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEntities = async () => {
        // const urlToShowAllEntities = URLS.API_ENTITY;
        const urlToShowAllEntities =  `${URLS.ENTITY_API}/entities`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEntities);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("res Entities", results);
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
                        // console.log("Entities",filteredEntities);
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


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des entités</h1>
                <div className='space-y-2'>
                    <CreateEntity setOpen={setOpen} onSubmit={fetchEntities} />
                    {columnsEntity && entities.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsEntity}
                            data={entities} 
                        />
                    )}
                </div>
                {showDialogEntity()}
            </div>
  );
}
