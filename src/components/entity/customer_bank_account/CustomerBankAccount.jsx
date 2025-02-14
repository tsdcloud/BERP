import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { CustomerBankAccountAction } from './ColumnsCustomerBankAccount';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateCustomerBankAccount from './CreateCustomerBankAccount';

export default function CustomerBankAccount() {
    const { showDialogCustomerBankAccount, columnsCustomerBankAccount } = CustomerBankAccountAction();
    const [customerBankAccounts, setCustomerBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchCustomerBankAccount = async () => {
        // const urlToShowAllCustomerBankAccount = URLS.API_CUSTOMER_BANK_ACCOUNT;
        const urlToShowAllCustomerBankAccount = `${URLS.ENTITY_API}/client-bank-accounts`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllCustomerBankAccount);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("res CustomerBankAccount", results);

                        const filteredCustomerBankAccount = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: rest.id, 
                                 accountNumber:rest.accountNumber,
                                 bankId:rest.bank.name,
                                 clientId:rest.customer.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        // console.log("CustomerBankAccount",filteredCustomerBankAccount);
                        setCustomerBankAccounts(filteredCustomerBankAccount);
                }
                else{
                    throw new Error('Erreur lors de la récupération des comptes bancaire des clients');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchCustomerBankAccount();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des comptes bancaire des clients</h1>
                <div className='space-y-2'>
                    <CreateCustomerBankAccount setOpen={setOpen} onSubmit={fetchCustomerBankAccount} />
                    { columnsCustomerBankAccount && customerBankAccounts?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsCustomerBankAccount}
                            data={customerBankAccounts} 
                        />
                    )}
                </div>
                {showDialogCustomerBankAccount()}
            </div>
  );
}
