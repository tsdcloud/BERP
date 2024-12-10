import './index.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './components/forms/SignIn';

function App() {
  // const [clicked, setClicked] = useState(0);
  return (
      <Router>
        <Routes>
           <Route path='/' element={<SignIn/>}/>
        </Routes>
      </Router>
  );
}

export default App;
