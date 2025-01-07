import { useState, useEffect } from 'react';
import CreateUser from './CreateUser';
import DataTable from '../DataTable'; 
import { UserAction } from './ColumnsUsers';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl'; 

export default function Users() {
    const { showDialogUser, columnsUser } = UserAction();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch } = useFetch();

    const fetchUsers = async () => {
        // const urlToShowAllUsers = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllUsers = URLS.API_USER;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllUsers);
            console.log("respo",response);
            
                if (response && response?.results) {
                        const results = response?.results;
                        const filteredUsers = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                        });
                        // console.log("Users", filteredUsers);
                        setUsers(filteredUsers);
                }
                else{
                    throw new Error('Erreur lors de la récupération des utilisateurs');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        fetchUsers();
        
    }, []);


  return (
            <div className='m-1 space-y-3 '>
                <h1 className='text-sm mb-2'>Gestion des utilisateurs</h1>
                <div className='space-y-2'>
                    <CreateUser setOpen={setOpen} onSubmit={fetchUsers} />
                    {columnsUser && users.length > 0 && (
                        <DataTable
                            className="rounded-md border w-[670px] text-xs"
                            columns={columnsUser}
                            data={users} 
                        />
                    )}
                </div>
                {showDialogUser()}
            </div>
  );
}
