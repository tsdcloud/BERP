import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { AsignEmpRoleAction } from './ColumnsAsignEmpRole';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateAsignEmpRole from './CreateAsignEmpRole';

export default function AsignEmpRole() {
    const { showDialogAsignEmpRole, ColumnsAsignEmpRole } = AsignEmpRoleAction();
    const [asignEmpRole, setAsignEmpRole] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchEmpRole = async () => {
        const urlToGetAsignEmpRole = `${URLS.ENTITY_API}/employee-roles`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToGetAsignEmpRole);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEmpRole = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return {
                            id:rest.id,
                            employeeId:rest.employee.name,
                            roleId:rest.role.roleName,
                            createdAt:rest.createdAt,
                            isActive:rest.isActive
                        };
                        });
                        // console.log("empRole", filteredEmpRole);
                        setAsignEmpRole(filteredEmpRole);
                }
                else{
                    throw new Error('Erreur lors de la récupération des emp - role');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchEmpRole();
        
    }, []);
  return (
    <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des assignations Employées - Rôles</h1>
                <div className='space-y-2'>
                    <CreateAsignEmpRole setOpen={setOpen} onSubmit={fetchEmpRole} />
                    {ColumnsAsignEmpRole && asignEmpRole.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={ColumnsAsignEmpRole}
                            data={asignEmpRole} 
                        />
                    )}
                </div>
                {showDialogAsignEmpRole()}
            </div>
  );
}
