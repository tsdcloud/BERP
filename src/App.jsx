import './index.css';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoutes from './hooks/ProtectedRoutes';
import SignIn from './components/forms/SignIn';
import Dashboard from './Pages/Dashboard';


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

function App() {
  const { token } = useContext(AUTHCONTEXT);


  return (
    <>
      <Router>

        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<Dashboard/>} exact/>
            <Route path='/chooseEntity' element={<ChooseEntity/>} exact/>
          </Route>
          
          <Route path='/signIn' element={<SignIn/>}/>
          <Route path='/forgetPassword' element={<ForgetPassword/>} exact/>
          <Route path='/confirmPassword' element={<ConfirmPassword/>} exact/>
          <Route path='*' element={<NotFoundPage/>} exact/>


           {/* Incident */}
           <Route path="/incidents">
              <Route path="" element={<Incident />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="maintenance-type" element={<Maintenance />} />
              <Route path="consommable" element={<Consommable />} />
              <Route path="equipement" element={<Equipement />} />
           </Route>
        </Routes>

       

         
      </Router>
      <Toaster/>
    </>
  );
}

export default App;