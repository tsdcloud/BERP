import { useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
// import mockUserData from '../../helpers/mock_userData.json';
import DataTable from '../DataTable';
import { UserAction } from './ColumnsUsers';
import { useFetch } from '../../hooks/useFetch';

export default function DashboardUser() {
    const { showDialogUser, columns, handleShowUser, handleEditUser } = UserAction();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const { handleFetch, err } = useFetch();

    // console.log("col", columns);

    useEffect(() => {
        const fetchUsers = async () => {
            const urlToShowAllUsers = "http://127.0.0.1:8000/api_gateway/api/user/";
            console.log(urlToShowAllUsers);
            try {
                const response = await handleFetch(urlToShowAllUsers);
                console.log("respo",response);
                
                if (response && response?.results) {
                        const results = response?.results;
                        const filteredUsers = results?.map(item => {
                           const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                           return rest;
                        });
                        console.log("Users", filteredUsers);
                        setUsers(filteredUsers);
        
                        console.log("filtered", filteredUsers);

                    }
                    else{
                        throw new Error('Erreur lors de la récupération des utilisateurs');
                    }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
        // Remplir les utilisateurs avec des données fictives
        // setUsers(mockUserData);
        // console.log(data);
    }, []);

    return (
        <div className='m-1 space-y-3'>
            <h1 className='text-sm mb-2'>Gestion des utilisateurs</h1>
            <div className='space-y-2'>
                {/* Formulaire pour créer des utilisateurs */}
                <CreateUser setOpen={setOpen} />

                {/* Tableau des données des utilisateurs */}
                {columns && users.length > 0 && (
                    <DataTable
                        className="rounded-md border w-[850px]"
                        columns={columns} // Passer les colonnes ici
                        data={users} 
                    />
                )}
            </div>
            {showDialogUser()}
        </div>
    );
}