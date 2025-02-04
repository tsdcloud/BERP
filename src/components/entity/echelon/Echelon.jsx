import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EchelonAction } from './ColumnsEchelon';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateEchelon from './CreateEchelon';

export default function Echelon() {
    const { showDialogEchelon, columnsEchelon } = EchelonAction();
    const [echelons, setEchelons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEchelon = async () => {
        const urlToShowAllEchelon = URLS.API_ECHELON;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEchelon);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEchelons = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("Echelons", filteredEchelons);
                        setEchelons(filteredEchelons);
                }
                else{
                    throw new Error('Erreur lors de la récupération des échelons');
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
                    {columnsEchelon && echelons.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsEchelon}
                            data={echelons} 
                        />
                    )}
                </div>
                {showDialogEchelon()}
            </div>
  );
}
