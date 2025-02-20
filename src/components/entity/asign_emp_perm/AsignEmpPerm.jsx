import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { AsignEmpPermAction } from './ColumnsAsignEmpPerm';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateAsignEmpPerm from './CreateAsignEmpPerm';

export default function AsignEmpPerm() {
    const { showDialogAsignEmpPerm, ColumnsAsignEmpPerm } = AsignEmpPermAction();
    const [asignEmpPerm, setAsignEmpPerm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEmpPerm = async () => {
        const urlToGetAsignEmpPerm = `${URLS.ENTITY_API}/employee-permissions`;
        // const urlToGetAsignEmpPerm = `https://entity.bfcgroupsa.com/api/employee-permissions`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToGetAsignEmpPerm);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEmpPerm = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return {
                            id:rest.id,
                            employeeId:rest.employee.name,
                            permissionId:rest.permission.displayName,
                            createdAt:rest.createdAt,
                            isActive:rest.isActive
                        };
                        });
                        // console.log("respEmpPerm", filteredEmpPerm);
                        setAsignEmpPerm(filteredEmpPerm);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Emp - Perm');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEmpPerm();
        
    }, []);
  return (
    <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des assignations Employé(e) - Permissions</h1>
                <div className='space-y-2'>
                    <CreateAsignEmpPerm setOpen={setOpen} onSubmit={fetchEmpPerm} />
                    {ColumnsAsignEmpPerm && asignEmpPerm?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={ColumnsAsignEmpPerm}
                            data={asignEmpPerm} 
                        />
                    )}
                </div>
                {showDialogAsignEmpPerm()}
            </div>
  );
}
