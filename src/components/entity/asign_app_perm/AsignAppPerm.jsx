import { useState, useEffect } from 'react';
import DataTable from '../../DataTable';
import { AsignAppPermAction } from './ColumnsAsignAppPerm';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import CreateAsignAppPerm from './CreateAsignAppPerm';

export default function AsignAppPerm() {
    const { showDialogAsignAppPerm, ColumnsAsignAppPerm } = AsignAppPermAction();
    const [asignAppPerm, setAsignAppPerm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchAppPerm = async () => {
        const urlToGetAsignAppPerm = `${URLS.ENTITY_API}/application-permissions`;
        
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToGetAsignAppPerm);
            // console.log("respo",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredAppPerm = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return {
                            id:rest.id,
                            applicationId:rest.application.name,
                            permissionId:rest.permission.displayName,
                            createdAt:rest.createdAt,
                            isActive:rest.isActive
                        };
                        });
                        // console.log("empRole", filteredAppPerm);
                        setAsignAppPerm(filteredAppPerm);
                }
                else{
                    throw new Error('Erreur lors de la récupération des app - perm');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchAppPerm();
        
    }, []);
  return (
    <div className='m-1 space-y-3 my-10'>
                <h1 className='text-sm my-3 font-semibold'>Gestion des assignations Applications - Permissions</h1>
                <div className='space-y-2'>
                    <CreateAsignAppPerm setOpen={setOpen} onSubmit={fetchAppPerm} />
                    {ColumnsAsignAppPerm && asignAppPerm.length >= 0 && (
                        <DataTable
                            className="rounded-md border w-[800px] text-xs"
                            columns={ColumnsAsignAppPerm}
                            data={asignAppPerm} 
                        />
                    )}
                </div>
                {showDialogAsignAppPerm()}
            </div>
  );
}
