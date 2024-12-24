import { useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
import mockUserData from '../../helpers/mock_userData.json';
import DataTable from '../DataTable';
import { UserAction } from './ColumnsUsers'; // Assurez-vous que le chemin est correct

export default function DashboardUser() {
    const { showDialogUser, columns, handleShowUser, handleEditUser } = UserAction(); // Récupérer les colonnes et les fonctions
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);

    // console.log("col", columns);

    useEffect(() => {
        // Remplir les utilisateurs avec des données fictives
        setUsers(mockUserData);
        console.log(users);
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
                        data={users} // Passer les utilisateurs ici
                    />
                )}
            </div>
            {showDialogUser()}
        </div>
    );
}