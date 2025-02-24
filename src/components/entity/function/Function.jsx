import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { FunctionAction } from './ColumnsFunction';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateFunction from './CreateFunction';

export default function Function() {
    const [functions, setFunctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchFunction = async () => {
        const urlToShowAllFunctions = `${URLS.ENTITY_API}/functions`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllFunctions);
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEntity = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        setFunctions(filteredEntity);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Functions');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchFunction();
        
    }, []);


    const updateData = (id, updatedFunctions) => {
        setFunctions((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedFunctions } : item
            )
        );
    };

    const delFunction = (id) => {
        setFunctions((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogFunction, columnsFunction } = FunctionAction({ delFunction, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Fonctions</h1>
                <div className='space-y-2 w-full'>
                    <CreateFunction setOpen={setOpen} onSubmit={fetchFunction} />
                    {columnsFunction && functions.length >= 0 && (
                        <DataTable
                             className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsFunction}
                            data={functions} 
                        />
                    )}
                </div>
                {showDialogFunction()}
            </div>
  );
}
