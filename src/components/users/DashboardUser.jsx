import { useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
// import mockUserData from '../../helpers/mock_userData.json';
import Preloader from '../Preloader';
import DataTable from '../DataTable';
import { UserAction } from './ColumnsUsers';
import { useFetch } from '../../hooks/useFetch';

export default function DashboardUser() {
    const { showDialogUser, columns, handleShowUser, handleEditUser } = UserAction();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    // console.log("col", columns);

    useEffect(() => {
        const fetchUsers = async () => {
            const urlToShowAllUsers = "http://127.0.0.1:8000/api_gateway/api/user/";
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
                            // console.log("filtered", filteredUsers);
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

        fetchUsers();
        
    }, []);

    return (
        <div className=''>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[200px] h-[200px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='m-1 space-y-3'>
                        <h1 className='text-sm mb-2'>Gestion des utilisateurs</h1>
                        <div className='space-y-2'>
                            <CreateUser setOpen={setOpen} />
                            {columns && users.length > 0 && (
                                <DataTable
                                    className="rounded-md border w-[770px] text-xs"
                                    columns={columns}
                                    data={users} 
                                />
                            )}
                        </div>
                        {showDialogUser()}
                    </div>
                )
            }

        </div>
    );
}