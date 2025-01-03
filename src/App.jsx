import './index.css';
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoutes from './hooks/ProtectedRoutes';
import SignIn from './components/forms/SignIn';
import Dashboard from './Pages/Dashboard';


import { AUTHCONTEXT } from './contexts/AuthProvider';

import ForgetPassword from './components/forms/ForgetPassword';
import ChooseEntity from './Pages/ChooseEntity';
import ConfirmPassword from './components/forms/ConfirmPassword';
import NotFoundPage from './components/NotFoundPage';

function App() {
  const { token } = useContext(AUTHCONTEXT);


  return (
      <Router>

        <Routes>
           <Route path='/' element={<Dashboard/>} exact/>
           <Route path='/chooseEntity' element={<ChooseEntity/>} exact/>
           <Route path='/signIn' element={<SignIn/>}/>
           <Route path='/forgetPassword' element={<ForgetPassword/>} exact/>
           <Route path='/confirmPassword' element={<ConfirmPassword/>} exact/>
           <Route path='*' element={<NotFoundPage/>} exact/>
        </Routes>

        {/* <div className="h-screen w-full bg-slate-100 font-poppins">
        <Routes>
          <Route element={<ProtectedRoutes />}>
              <Route path="*" element={<Dashboard  />}/>
              <Route path="/" exact element={<Dashboard  />}/>
              <Route path='/services'>
                <Route path=":id" exact element={<div>ID Services</div>}/>

                {/* <Route path="finances">
                    <Route path="" exact element={<FinancesDashboard  />}/>
                    <Route path=":id" exact element={<Budget />}/>
                </Route> */}
              {/* </Route> */}
          {/* </Route> */}

          {/* { token === "" &&
            <Route  element={<SignedOutRoutes />}>
                  <Route path="*" exact element={
                        <Login />
                    }/>
                  <Route path="/signin" exact element={
                      <>
                        <Login />
                      </>
                    }/>
                  <Route path="/signup" exact element={
                      <>
                        <SignUp />
                      </>
                    }/>
                  <Route path="/forgot-password" exact element={
                      <>
                        <SignUp />
                      </>
                    }/>
            </Route>
          } */}
          
        {/* // </Routes> */}
      {/* // </div> */}
        
      </Router>
  );
}

export default App;