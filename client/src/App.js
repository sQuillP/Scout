import { Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Auth from './pages/auth/Auth';
import Signup from './pages/auth/Signup';



function App() {
  return (
    <Routes>
      <Route path='/auth' element={<Auth/>}>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
      {/* Home page will have a list of all projects */}
      <Route path='/projects' element={<Projects/>}>
        <Route path=':projectId' element={<ViewProject/>}>

          {/* add all child routes of each project i.e analytics, users, tickets,  */}
          {/* <Route path='analytics' element={<ViewAnalytics/>}/> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
