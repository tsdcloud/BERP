import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { BankAction } from './ColumnsBank';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateBank from './CreateBank';

export default function Bank() {
    const [banks, setBanks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchBank = async () => {
        const urlToShowAllBank = `${URLS.ENTITY_API}/banks`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllBank);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredBank = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("bank", filteredBank);
                        setBanks(filteredBank);
                }
                else{
                    throw new Error('Erreur lors de la récupération des banques');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchBank();
        
    }, []);

    const updateData = (id, updatedBank) => {
        setBanks((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedBank } : item
            )
        );
    };

    const delBank = (id) => {
        setBanks((prev) =>
            prev.filter((item) => item.id != id
        ));
    };


    const { showDialogBank, columnsBank } = BankAction({ updateData, delBank});
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Banques</h1>
                <div className='space-y-2 w-full'>
                    <CreateBank setOpen={setOpen} onSubmit={fetchBank} />
                    {columnsBank && banks.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsBank}
                            data={banks} 
                        />
                    )}
                </div>
                {showDialogBank()}
            </div>
  );
}
