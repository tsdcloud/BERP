import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { CustomerAction } from './ColumnsCustomer';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateCustomer from './CreateCustomer';

export default function Customer() {
    const { showDialogCustomer, columnsCustomer } = CustomerAction();
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchCustomer = async () => {
        const urlToShowAllCustomers = URLS.API_CUSTOMER;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllCustomers);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredCustomers = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        // console.log("Clients", filteredCustomers);
                        setCustomers(filteredCustomers);
                }
                else{
                    throw new Error('Erreur lors de la récupération des customers');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchCustomer();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Clients</h1>
                <div className='space-y-2'>
                    <CreateCustomer setOpen={setOpen} onSubmit={fetchCustomer} />
                    {columnsCustomer && customers.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsCustomer}
                            data={customers} 
                        />
                    )}
                </div>
                {showDialogCustomer()}
            </div>
  );
}
