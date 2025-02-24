import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { EntityBankAccountAction } from './ColumnsEntityBankAccount';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateEntityBankAccount from './CreateEntityBankAccount';

export default function EntityBankAccount() {
    const [EntityBankAccounts, setEntityBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEntityBankAccount = async () => {
        const urlToShowAllEntityiesBankAccount = `${URLS.ENTITY_API}/entity-bank-accounts`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEntityiesBankAccount);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
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


    const updateData = (id, updatedEntiyBankAccount) => {
        setEntityBankAccounts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedEntiyBankAccount } : item
            ));
            fetchEntityBankAccount();
    };

    const delEntityBankAccount = (id) => {
        setEntityBankAccounts((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogEntityBankAccount, columnsEntityBankAccount } = EntityBankAccountAction({ delEntityBankAccount, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des comptes bancaire des entités</h1>
                <div className='space-y-2 w-full'>
                    <CreateEntityBankAccount setOpen={setOpen} onSubmit={fetchEntityBankAccount} />
                    { columnsEntityBankAccount && EntityBankAccounts?.length >= 0 && (
                        <DataTable
                           className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsEntityBankAccount}
                            data={EntityBankAccounts} 
                        />
                    )}
                </div>
                {showDialogEntityBankAccount()}
            </div>
  );
}
