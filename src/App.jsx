import './index.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './components/forms/SignIn';
import ChooseEntity from './Pages/ChooseEntity';
import Dashboard from './Pages/Dashboard';

function App() {
  // const [clicked, setClicked] = useState(0);
  return (
      <Router>
        <Routes>
           <Route path='/' element={<SignIn/>}/>
           <Route path='/chooseEntity' element={<ChooseEntity/>} exact/>
           <Route path='/dashboard' element={<Dashboard/>} exact/>
        </Routes>
      </Router>
  );
}

export default App;
