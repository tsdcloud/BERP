import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EntityBankAccountAction } from './ColumnsEntityBankAccount';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateEntityBankAccount from './CreateEntityBankAccount';

export default function EntityBankAccount() {
    const { showDialogEntityBankAccount, columnsEntityBankAccount } = EntityBankAccountAction();
    const [EntityBankAccounts, setEntityBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEntityBankAccount = async () => {
        // const urlToShowAllEntityiesBankAccount = URLS.API_ENTITY_BANK_ACCOUNT;
        const urlToShowAllEntityiesBankAccount = `${URLS.ENTITY_API}/entity-bank-accounts`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEntityiesBankAccount);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("res EntityBankAccount", results);

                        const filteredEntityBankAccount = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { 
                                 id: rest.id, 
                                 accountNumber:rest.accountNumber,
                                 bankId:rest.bank.name,
                                 entityId:rest.entity.name,
                                 createdAt:rest.createdAt,
                                 isActive:rest.isActive,
                                };
                    });
                        // console.log("EntityBankAccount",filteredEntityBankAccount);
                        setEntityBankAccounts(filteredEntityBankAccount);
                }
                else{
                    throw new Error('Erreur lors de la récupération des comptes bancaire des entités');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEntityBankAccount();
        
    }, []);


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des comptes bancaire des entités</h1>
                <div className='space-y-2'>
                    <CreateEntityBankAccount setOpen={setOpen} onSubmit={fetchEntityBankAccount} />
                    { columnsEntityBankAccount && EntityBankAccounts?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsEntityBankAccount}
                            data={EntityBankAccounts} 
                        />
                    )}
                </div>
                {showDialogEntityBankAccount()}
            </div>
  );
}
