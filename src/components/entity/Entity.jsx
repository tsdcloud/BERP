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
        // const urlToShowAllEntities = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllEntities = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEntities);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredEntity = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Entities", filteredEntity);
                        setEntities(filteredEntity);
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
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogEntity()}
            </div>
  );
}
