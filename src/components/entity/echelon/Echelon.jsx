import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EchelonAction } from './ColumnsEchelon';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateEchelon from './CreateEchelon';

export default function Echelon() {
    const { showDialogEchelon, columnsEchelon } = EchelonAction();
    const [Echelons, setEchelons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEchelon = async () => {
        // const urlToShowAllEchelons = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllEchelons = "";
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEchelons);
            // console.log("respo",response);
            
                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredEchelon = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Echelons", filteredEchelon);
                        setEchelons(filteredEchelon);
                }
                else {
                    throw new Error('Erreur lors de la récupération des Echelons');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEchelon();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Echelons</h1>
                <div className='space-y-2'>
                    <CreateEchelon setOpen={setOpen} onSubmit={fetchEchelon} />
                    {columnsEchelon && Echelons.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsEchelon}
                            data={Echelons} 
                        />
                        // <div>Je ne pas là.</div>
                    )}
                </div>
                {showDialogEchelon()}
            </div>
  );
}
