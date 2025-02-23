import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { PermissionAction } from './ColumnsPermission';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreatePermission from './CreatePermission';

export default function Permission() {
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchPermission = async () => {
        const urlToShowAllPerm = `${URLS.ENTITY_API}/permissions`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllPerm);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredPerm = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: item.id,
                            displayName:rest.displayName || "non défini",
                            permissionName:rest.permissionName || "non défini",
                            description:rest.description || "non défini",
                            createdAt:rest.createdAt
                            };
                    });
                        setPermissions(filteredPerm);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Permissions');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchPermission();
        
    }, []);

    const updateData = (id, updatedPermission) => {
        setPermissions((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedPermission } : item
            )
        );
    };

    const delPermission = (id) => {
        setPermissions((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogPermission, columnsPermission } = PermissionAction({ delPermission, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Permissions de l'entité</h1>
                <div className='space-y-2 w-full'>
                    <CreatePermission setOpen={setOpen} onSubmit={fetchPermission} />
                    { columnsPermission && permissions?.length >= 0 && (
                        <DataTable
                             className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsPermission}
                            data={permissions} 
                        />
                    )}
                </div>
                {showDialogPermission()}
            </div>
  );
}
