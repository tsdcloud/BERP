import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EchelonAction } from './ColumnsEchelon';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateEchelon from './CreateEchelon';

export default function Echelon() {
    const [echelons, setEchelons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEchelon = async () => {
        const urlToShowAllEchelon = `${URLS.ENTITY_API}/echelons`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEchelon);
             if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEchelons = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
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

    const updateData = (id, updatedEchelon) => {
        setEchelons((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedEchelon } : item
            )
        );
    };

    const delEchelon = (id) => {
        setEchelons((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogEchelon, columnsEchelon } = EchelonAction({ delEchelon, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Echelons</h1>
                <div className='space-y-2 w-full'>
                    <CreateEchelon setOpen={setOpen} onSubmit={fetchEchelon} />
                    {columnsEchelon && echelons.length >= 0 && (
                        <DataTable
                           className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsEchelon}
                            data={echelons} 
                        />
                    )}
                </div>
                {showDialogEchelon()}
            </div>
  );
}
