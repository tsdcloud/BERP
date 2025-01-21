import { useState, useEffect } from 'react';
import CreateUser from './CreateUser';
import DataTable from '../DataTable'; 
import { UserAction } from './ColumnsUsers';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';

import Preloader from '../Preloader';


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
            
                if (response && response?.data?.results) {
                    const results = response?.data?.results;
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
            <div className='m-1 space-y-3 my-10 w-full'>
                <h1 className='text-sm'>Gestion des utilisateurs</h1>
                <div className='space-y-2 w-full'>
                    <CreateUser setOpen={setOpen} onSubmit={fetchUsers} />
                    {columnsUser && users.length > 0 ? (
                        <DataTable
                            className="rounded-md border w-full max-w-full text-xs sm:text-sm"
                            columns={columnsUser}
                            data={users} 
                        />    
                    ) : <Preloader size={40} />}
                </div>
                {showDialogUser()}
            </div>
  );
}
