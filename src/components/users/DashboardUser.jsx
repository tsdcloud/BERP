import {useState, useEffect } from 'react';
import CreateUser from '../forms/users/CreateUser';
import mockUserData from '../../helpers/mock_userData.json';
import DataTable from '../DataTable';
import { columnsUsers } from './columnsUsers';
import { Button } from '../ui/button';


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
    <div className='space-y-3'>
        {/* form for creating users */}
        <CreateUser/>

        {/* Users Data Table */}
        <DataTable
        className="rounded-md border w-[900px]"
        columns={columnsUsers}
        data={users}
        Action={<Button>Action</Button>}
       
        />

    </div>
  );
}
