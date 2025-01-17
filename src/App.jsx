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


//entités
import Entity from './Pages/entity/index';
import Department from './Pages/entity/Department';
import Service from './Pages/entity/Service';
import Function from './Pages/entity/Function';




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
            <Route path="/entités">
                <Route path="" element={<Entity />} />
               <Route path="department" element={<Department />} />
               <Route path="service" element={<Service />} />
               <Route path="function" element={<Function />} />

                {/* 
                <Route path="asign_perm_role" element={<AsignPermRole />} />
                <Route path="asign_perm_app" element={<AsignPermApp />} />
                <Route path="asign_perm_user" element={<AsignPermUser />} />
                <Route path="asign_role_user" element={<AsignRoleUser />} /> 
                */}
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