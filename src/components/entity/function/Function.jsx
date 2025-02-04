import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { FunctionAction } from './ColumnsFunction';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateFunction from './CreateFunction';

export default function Function() {
    const { showDialogFunction, columnsFunction } = FunctionAction();
    const [functions, setFunctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchFunction = async () => {
        const urlToShowAllFunctions = URLS.API_FUNCTION;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllFunctions);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEntity = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("Functions", filteredEntity);
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


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Fonctions</h1>
                <div className='space-y-2'>
                    <CreateFunction setOpen={setOpen} onSubmit={fetchFunction} />
                    {columnsFunction && functions.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsFunction}
                            data={functions} 
                        />
                    )}
                </div>
                {showDialogFunction()}
            </div>
  );
}
