import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { AsignRolePermAction } from './ColumnsAsignRolePerm';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateAsignRolePerm from './CreateAsignRolePerm';

export default function AsignRolePerm() {
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
                        // console.log("respRolePerm", filteredRolePerm);
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

    const updateData = (id, updatedCountry) => {
        setAsignRolePerm((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedCountry } : item
            )
        );
    };

    const delAsignRolePerm = (id) => {
        setAsignRolePerm((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogAsignRolePerm, ColumnsAsignRolePerm } = AsignRolePermAction({ updateData, delAsignRolePerm });
  return (
    <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des assignations Rôles - Permissions</h1>
                <div className='space-y-2 w-full'>
                    <CreateAsignRolePerm setOpen={setOpen} onSubmit={fetchRolePerm} />
                    {ColumnsAsignRolePerm && asignRolePerm.length >= 0 && (
                        <DataTable
                           className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={ColumnsAsignRolePerm}
                            data={asignRolePerm} 
                        />
                    )}
                </div>
                {showDialogAsignRolePerm()}
            </div>
  );
}
