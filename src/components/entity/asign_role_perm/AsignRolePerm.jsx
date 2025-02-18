import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { AsignRolePermAction } from './ColumnsAsignRolePerm';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateAsignRolePerm from './CreateAsignRolePerm';

export default function AsignRolePerm() {
    const { showDialogAsignRolePerm, ColumnsAsignRolePerm } = AsignRolePermAction();
    const [asignRolePerm, setAsignRolePerm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchRolePerm = async () => {
        const urlToGetAsignRolePerm = `${URLS.ENTITY_API}/permission-roles`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToGetAsignRolePerm);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredRolePerm = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return {
                            id:rest.id,
                            roleId:rest.role.roleName,
                            permissionId:rest.permission.displayName,
                            createdAt:rest.createdAt,
                            isActive:rest.isActive
                        };
                        });
                        console.log("respRolePerm", filteredRolePerm);
                        setAsignRolePerm(filteredRolePerm);
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
        fetchRolePerm();
        
    }, []);
  return (
    <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des assignations Rôles - Permissions</h1>
                <div className='space-y-2'>
                    <CreateAsignRolePerm setOpen={setOpen} onSubmit={fetchRolePerm} />
                    {ColumnsAsignRolePerm && asignRolePerm.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={ColumnsAsignRolePerm}
                            data={asignRolePerm} 
                        />
                    )}
                </div>
                {showDialogAsignRolePerm()}
            </div>
  );
}
