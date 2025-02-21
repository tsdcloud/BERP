import { useState, useEffect } from 'react';
import DataTable from '../../DataTable'; 
import { RoleAction } from './ColumnsRole';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl'; 
import CreateRole from './CreateRole';

export default function Role() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchRole = async () => {
        const urlToShowAllRole =  `${URLS.ENTITY_API}/roles`;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllRole);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredroles = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return rest;
                        });
                        setRoles(filteredroles);
                }
                else{
                    throw new Error('Erreur lors de la récupération des roles');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchRole();
        
    }, []);


    const updateData = (id, updatedRole) => {
        setRoles((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedRole } : item
            )
        );
    };

    const delRole = (id) => {
        setRoles((prev) =>
            prev.filter((item) => item.id != id
        ));
    };

    const { showDialogRole, columnsRole } = RoleAction({ delRole, updateData });
  return (
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm mb-2 font-semibold'>Gestion des Rôles</h1>
                <div className='space-y-2 w-full'>
                    <CreateRole setOpen={setOpen} onSubmit={fetchRole} />
                    { columnsRole && roles?.length >= 0 && (
                        <DataTable
                           className="rounded-md border w-[700px] max-w-full text-xs sm:text-sm"
                            columns={columnsRole}
                            data={roles} 
                        />
                    )}
                </div>
                {showDialogRole()}
            </div>
  );
}
