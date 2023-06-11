import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Auth from './pages/auth/Auth';
import Signup from './pages/auth/Signup';
import ProjectHome from './pages/projects/ProjectHome';
import ProjectDashboard from './pages/project dashboard/ProjectDashboard';


function App() {
  return (
    <Routes>
      <Route path='/auth'  element={<Auth/>}>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
      <Route path='/projects' element={<ProjectHome/>}/>
      <Route path='/projects/:projectId' element={<ProjectDashboard/>}/>
      
      <Route path='*' Component={()=> <Navigate to='/auth/login'/>}/>
      {/* Home page will have a list of all projects */}
      {/* <Route path='/projects' element={<Projects/>}> */}
        {/* <Route path=':projectId' element={<ViewProject/>}> */}

          {/* add all child routes of each project i.e analytics, users, tickets,  */}
          {/* <Route path='analytics' element={<ViewAnalytics/>}/> */}
        {/* </Route> */}
      {/* </Route> */}
    </Routes>
  );
}

export default App;
