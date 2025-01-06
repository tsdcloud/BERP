import { useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
// import mockUserData from '../../helpers/mock_userData.json';
import Preloader from '../Preloader';
import DataTable from '../DataTable';
import { UserAction } from './ColumnsUsers';
import { PermissionAction } from './ColumnsPermissions';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import CreatePermission from '../forms/users/CreatePermission';


//c'est ici que je vais gérer le tabs, toutes les instances de User.
export default function DashboardUser() {
    const { showDialogUser, columnsUser, handleShowUser, handleEditUser } = UserAction();
    const { showDialogPermission, columnsPermission, handleShowPermission, handleEditPermission } = PermissionAction();
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch } = useFetch();

    // console.log("col", columns);

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
    const fetchPermissions = async () => {
        // const urlToShowAllUsers = "http://127.0.0.1:8000/api_gateway/api/user/";
        const urlToShowAllPermissions = URLS.API_PERMISSION;
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllPermissions);
            console.log("respoPermissions",response);
            
                if (response && response?.results) {
                        const results = response?.results;
                        const filteredPermissions = results?.map(item => {
                        const { perm_created_by, perm_updated_by, ...rest } = item;
                        return rest;
                        });
                        // console.log("Users", filteredPermissions);
                        setPermissions(filteredPermissions);
                        console.log("filtered Permissions", filteredPermissions);
                }
                else{
                    throw new Error('Erreur lors de la récupération des permissions');
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
        fetchPermissions();
        
    }, []);

    return (
        <div className='flex sm:justify-normal justify-center sm:items-start items-center m-0 lg:m-4 mb-7'>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[100px] h-[100px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='flex sm:flex-col lg:flex-row'>

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
                        <div className='m-1 space-y-3 '>
                            <h1 className='text-sm mb-2'>Gestion des persmissions</h1>
                            <div className='space-y-2'>
                                <CreatePermission setOpen={setOpen} onSubmit={fetchPermissions}/>
                                {columnsPermission && permissions.length > 0 && (
                                    <DataTable
                                        className="rounded-md border w-[670px] text-xs"
                                        columns={columnsPermission}
                                        data={permissions} 
                                    />
                                )}
                            </div>
                            {showDialogPermission()}
                        </div>

                    </div>
                )
            }

        </div>
    );
}