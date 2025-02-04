import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { PermissionAction } from './ColumnsPermission';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreatePermission from './CreatePermission';

export default function Permission() {
    const { showDialogPermission, columnsPermission } = PermissionAction();
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchPermission = async () => {
        const urlToShowAllPerm = URLS.API_PERMISSION_ENTITY;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllPerm);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        console.log("res", results);

                        const filteredPerm = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { id: item.id, ...rest};
                    });
                        console.log("perm",filteredPerm);
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


  return (
            <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des Permissions de l'entité</h1>
                <div className='space-y-2'>
                    <CreatePermission setOpen={setOpen} onSubmit={fetchPermission} />
                    { columnsPermission && permissions?.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={columnsPermission}
                            data={permissions} 
                        />
                    )}
                </div>
                {showDialogPermission()}
            </div>
  );
}
