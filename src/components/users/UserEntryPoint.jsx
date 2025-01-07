import { useState, useEffect } from 'react';
import CreateUser from './CreateUser';
// import mockUserData from '../../helpers/mock_userData.json';
import Preloader from '../Preloader';
import DataTable from '../DataTable';
import { UserAction } from './ColumnsUsers';
import { PermissionAction } from './Pemissions/ColumnsPermissions';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import CreatePermission from './Pemissions/CreatePermission';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../common/Tabs';
import Users from './Users';
import Permission from './Pemissions/Permission';
import Role from './Roles/Role';
import Application from './Applications/Application';


//c'est ici que je vais gérer le tabs, toutes les instances de User.
export default function UserEntryPoint() {
    const { showDialogUser, columnsUser, handleShowUser, handleEditUser } = UserAction();
    const { showDialogPermission, columnsPermission, handleShowPermission, handleEditPermission } = PermissionAction();
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { pathname } = useLocation();

     const links = [
        {
            name:"Utilisateurs",
            isActive:pathname.includes("user") ? true : false,
            link: "/view/users"
        },
        {
            name:"Permissions",
            isActive:pathname.includes("permission") ? true : false,
            link: "/view/permission"
        },
        {
            name:"Rôles",
            isActive: pathname.includes("role") ? true : false,
            link: "/view/role"
        },
        {
            name:"Application",
            isActive:pathname.includes("application") ? true : false,
            link: "/view/application"
        },
        {
            name:"Assignation Permission & Rôle",
            isActive:pathname.includes("asign_perm_role") ? true : false,
            link: "/view/asign_perm_role"
        },
        {
            name:"Assignation Permission & Application",
            isActive:pathname.includes("asign_perm_app") ? true : false,
            link: "/view/asign_perm_app"
        },
        {
            name:"Assignation Utilisateur & Permission",
            isActive:pathname.includes("asign_user_perm") ? true : false,
            link: "/view/asign_user_perm"
        },
        {
            name:"Assignation Utilisateur & Rôle",
            isActive:pathname.includes("asign_user_role") ? true : false,
            link: "/view/asign_user_role"
        }
    ];


  

 

    return (
        <div className='flex sm:justify-normal justify-center sm:items-start items-center m-0 lg:m-4 mb-7'>
            {

                isLoading ? (
                    <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[100px] h-[100px]"/>
                        <h6>Chargement...</h6>
                    </div>
                ) : (
                    <div className='flex sm:justify-normal justify-center sm:items-start items-center m-0 lg:m-4 mb-7'>
                    <Tabs links={links} />
                   
                </div>
                )
            }

        </div>
    );
}