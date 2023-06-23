import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Auth from './pages/auth/Auth';
import Signup from './pages/auth/Signup';
import ProjectHome from './pages/projects/ProjectHome';
import ProjectDashboard from './pages/project dashboard/pages/ProjectDashboard';
import Members from './pages/project dashboard/pages/Members';
import Project from './pages/project dashboard/Project';
import Tickets from './pages/project dashboard/pages/Tickets';

function App() {
  return (
    <Routes>

      <Route path='/auth'  element={<Auth/>}>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
      <Route path='/projects' element={<ProjectHome/>}/>
      <Route path='/projects/:projectId' element={<Project/>}>
        <Route index element={<ProjectDashboard/>}/>
        <Route path='members' element={<Members/>}/>
        {/* /tickets */}
        <Route path='tickets' element={<Tickets/>}/>
        {/* settings */}
        {/* analytics */}
      </Route>
      <Route path='*' Component={()=> <Navigate to='/auth/login'/>}/>
    </Routes>
  );
}

export default App;
