import React from 'react';
import CreateUser from '../components/forms/users/CreateUser';

export default function Dashboard() {

   
  return (
         <div className='m-4'>
            <h1>Gestion des utilisateurs</h1>
             <CreateUser />
        </div>
  );
}
