import {useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
import mockUserData from '../../helpers/mock_userData.json';
import DataTable from '../DataTable';
import { columnsUsers } from './ColumnsUsers';
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";


export default function DashboardUser() {
    const [users, setUsers] = useState([]);

    useEffect(()=>{

        // fetch('https://dummyjson.com/users')
        // .then(res => res.json())
        // .then(data =>{
        //     setShowAllUsers(data.users);
        //     console.log(data.users);
        // })
        // .catch(error => console.error("Error to fetching data users:", error));

        setUsers(mockUserData);
        console.log(users);

    }, [users]);

  return (
    <div className='m-1 space-y-3'>
          <h1 className='text-sm mb-2'>Gestion des utilisateurs</h1>


          {/* <ArrowLongLeftIcon className="h-6 w-6 text-gray-500" /> */}
            <div className='space-y-2'>

                        {/* form for creating users */}
                        <CreateUser/>

                        {/* Users Data Table */}
                        <DataTable
                            className="rounded-md border w-[850px]"
                            columns={columnsUsers}
                            data={users}
                        />
            </div>
    </div>
  );
}
