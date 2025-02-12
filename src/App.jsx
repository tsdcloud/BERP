import './index.css';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoutes from './hooks/ProtectedRoutes';
import SignIn from './components/forms/SignIn';
import LuncherApp from './Pages/LuncherApp';


import { AUTHCONTEXT } from './contexts/AuthProvider';

import ForgetPassword from './components/forms/ForgetPassword';
import ChooseEntity from './Pages/ChooseEntity';
import ConfirmPassword from './components/forms/ConfirmPassword';
import NotFoundPage from './components/NotFoundPage';

// Incident
import Incident from './Pages/incidents/index';
import Consommable from './Pages/incidents/Consommable';

//user
import User from './Pages/users/index';
import Permission from './Pages/users/Permission';
import Role from './Pages/users/Role';
import Application from './Pages/users/Application';
import AsignPermRole from './Pages/users/AsignPermRole';
import AsignPermApp from './Pages/users/AsignPermApp';
import AsignPermUser from './Pages/users/AsignPermUser';
import AsignRoleUser from './Pages/users/AsignRoleUser';


//entities
import Entity from './Pages/entity/index';
import Department from './Pages/entity/Department';
import Service from './Pages/entity/Service';
import Function from './Pages/entity/Function';
import Grade from './Pages/entity/Grade';
import Echelon from './Pages/entity/Echelon';
import Category from './Pages/entity/Category';
import Employee from './Pages/entity/Employee';
import Bank from './Pages/entity/Bank';
import Customer from './Pages/entity/Customer';
import Country from './Pages/entity/Country';
import RoleEntity from './Pages/entity/Role';
import ApplicationEntity from './Pages/entity/Application';
import PermissionEntity from './Pages/entity/Permission';
import District from './Pages/entity/District';
import Town from './Pages/entity/Town';
import CustomerBankAccount from './Pages/entity/CustomerBankAccount';
import EntityBankAccount from './Pages/entity/EntityBankAccount';
import Site from './Pages/entity/Site';
import Supplier from './Pages/entity/Supplier';




function App() {
  const { token } = useContext(AUTHCONTEXT);


  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<LuncherApp/>} exact/>
            <Route path='/chooseEntity' element={<ChooseEntity/>} exact/>

              {/* User */}
            <Route path="/utilisateurs">
                <Route path="" element={<User />} />
                <Route path="permission" element={<Permission />} />
                <Route path="role" element={<Role />} />
                <Route path="application" element={<Application />} />
                <Route path="asign_perm_role" element={<AsignPermRole />} />
                <Route path="asign_perm_app" element={<AsignPermApp />} />
                <Route path="asign_perm_user" element={<AsignPermUser />} />
                <Route path="asign_role_user" element={<AsignRoleUser />} />
            </Route>

              {/* Entités */}
            <Route path="/entities">
                <Route path="" element={<Entity />} />
               <Route path="departments" element={<Department />} />
               <Route path="employees" element={<Employee />} />
               <Route path="services" element={<Service />} />
               <Route path="functions" element={<Function />} />
               <Route path="grades" element={<Grade />} />
               <Route path="echelons" element={<Echelon />} />
               <Route path="categories" element={<Category />} />
               <Route path="banks" element={<Bank />} />
               <Route path="customers" element={<Customer />} />
               <Route path="countries" element={<Country />} />
               <Route path="roles" element={<RoleEntity/>} />

               <Route path="applications" element={<ApplicationEntity/>} />
               
               <Route path="permissions" element={<PermissionEntity/>} />
               <Route path="districts" element={<District/>} />
               <Route path="towns" element={<Town/>} />
               <Route path="customer_bank_accounts" element={<CustomerBankAccount/>} />
               <Route path="entity_bank_accounts" element={<EntityBankAccount/>} />
               <Route path="sites" element={<Site/>} />
               <Route path="suppliers" element={<Supplier/>} />




                
            </Route>

          </Route>
          
          <Route path='/signIn' element={<SignIn/>}/>
          <Route path='/forgetPassword' element={<ForgetPassword/>} exact/>
          <Route path='/confirmPassword' element={<ConfirmPassword/>} exact/>
          <Route path='*' element={<NotFoundPage/>} exact/>


          


           {/* Incident */}
           <Route path="/incidents">
              <Route path="" element={<Incident />} />
              <Route path="maintenance" element={<Consommable />} />
              <Route path="consommable" element={<Consommable />} />
              <Route path="equipement" element={<Consommable />} />
           </Route>
        </Routes>
      </Router>
      <Toaster/>
    </>
  );
}

export default App;