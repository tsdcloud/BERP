import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { FunctionAction } from './ColumnsFunction';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateFunction from './CreateFunction';

export default function Function() {
    const { showDialogFunction, columnsFunction } = FunctionAction();
    const [Functions, setFunctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchFunction = async () => {
        // const urlToShowAllFunctions = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllFunctions = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllFunctions);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredEntity = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
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
                <h1 className='text-sm my-3 font-semibold'>Gestion des Functions</h1>
                <div className='space-y-2'>
                    <CreateFunction setOpen={setOpen} onSubmit={fetchFunction} />
                    {columnsFunction && Functions.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsFunction}
                            data={Functions} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogFunction()}
            </div>
  );
}
