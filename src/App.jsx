import './index.css';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoutes from './hooks/ProtectedRoutes';
import IncidenSettingRoutes from './utils/IncindentSettingRoutes';
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
import Maintenance from './Pages/incidents/Maintenance';
import Equipement from './Pages/incidents/Equipement';
import TypeMaintenance from './Pages/incidents/MaintenanceType';
import IncidentCauses from './Pages/incidents/IncidentCauses';
import IncidentType from './Pages/incidents/IncidentType';
import Operation from './Pages/incidents/Operation';
import Movement from './Pages/incidents/Movement';

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
import Dashboard from './Pages/incidents/Dashboard';
import OffBridge from './Pages/incidents/OffBridge';
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
import Shift from './Pages/entity/Shift';
import AsignEmpRole from './Pages/entity/AsignEmpRole';
import AsignAppPerm from './Pages/entity/AsignAppPerm';
import AsignRolePerm from './Pages/entity/AsignRolePerm';
import AsignEmpPerm from './Pages/entity/AsignEmpPerm';
import { usePermissions } from './contexts/PermissionsProvider';
import EquipmentGroup from './Pages/incidents/EquipmentGroup';



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
               <Route path="shifts" element={<Shift/>} />
               <Route path="asign_emp_roles" element={<AsignEmpRole/>} />
               <Route path="asign_app_perms" element={<AsignAppPerm/>} />
               <Route path="asign_role_perms" element={<AsignRolePerm/>} />
               <Route path="asign_emp_perms" element={<AsignEmpPerm/>} />
            </Route>

            {/* Incident */}
           {/* <Route path="/incidents">
              <Route path="" element={<Incident />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="off-bridge" element={<OffBridge />} />
              <Route element={<IncidenSettingRoutes permissions={["incident__view_incident_types"]}/>}>
                <Route path="incident-type" element={<IncidentType />} />
              </Route>
              <Route element={<IncidenSettingRoutes permissions={["incident__view_incident_causes"]}/>}>
                <Route path="incident-cause" element={<IncidentCauses />} />
              </Route>
              <Route element={<IncidenSettingRoutes permissions={["incident__view_maintenance-types"]}/>}>
                <Route path="maintenance-type" element={<TypeMaintenance />} />
              </Route>
              <Route element={<IncidenSettingRoutes permissions={["incident__view_equipements"]}/>}>
                <Route path="equipement" element={<Equipement />} />
              </Route>
              <Route element={<IncidenSettingRoutes permissions={["incident__view_equipment-groups"]}/>}>
                <Route path="equipment-groups" element={<EquipmentGroup />} />
              </Route>
              <Route path="operations" element={<Operation />} />
              <Route path="movements" element={<Movement />} />
           </Route> */}

          </Route>
          
          <Route path='/signIn' element={<SignIn/>}/>
          <Route path='/forgetPassword' element={<ForgetPassword/>} exact/>
          <Route path='/confirmPassword' element={<ConfirmPassword/>} exact/>
          <Route path='*' element={<NotFoundPage/>} exact/>
        </Routes>
      </Router>
      <Toaster/>
    </>
  );
}

export default App;