import { 
  Routes, 
  Route, 
  Navigate,
} from 'react-router-dom';

import Login from './pages/auth/Login';
import Auth from './pages/auth/Auth';
import Signup from './pages/auth/Signup';
import ProjectHome from './pages/projects/ProjectHome';
import ProjectDashboard from './pages/project dashboard/pages/ProjectDashboard';
import Members from './pages/project dashboard/pages/Members';
import Project from './pages/project dashboard/Project';
import Tickets from './pages/project dashboard/pages/Tickets';
import ViewTicket from './pages/project dashboard/pages/ViewTicket';
import ProjectSettings from './pages/project dashboard/pages/ProjectSettings';
import ProtectRoute from './components/ProtectRoute';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginFromStoredToken, updateUserSync } from './redux/slice/authSlice';
import ViewProfile from './pages/profile/ViewProfile';
import Scout from './axios/scout';


function App() {

  const dispatch = useDispatch();
  const user = useSelector((store)=> store.auth.user);

  useEffect(()=> {
    dispatch(loginFromStoredToken());

    if(user === null && localStorage.getItem('token') !== null) {
      (async ()=> {
        try {
          console.log('fetching profile')
          const responseUser = await Scout.get('/users/myDetails');
          dispatch(updateUserSync(responseUser.data.data));
        } catch(error) {
          console.log(error, error.message);
        }
      })();
    }
  },[]);


  return (
    <Routes>
      <Route path='/auth'  element={<Auth/>}>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
      <Route path='/projects' element={
        <ProtectRoute>
          <ProjectHome/>
        </ProtectRoute>
      }/>
      <Route path='/projects/:projectId' element={<ProtectRoute> <Project/> </ProtectRoute>}>
        <Route index element={<ProjectDashboard/>}/>
        <Route path='members' element={<Members/>}/>
        <Route path='tickets' element={<Tickets/>}/>
        <Route path='tickets/:ticketId' element={<ViewTicket/>}/>
        <Route path='settings' element={<ProjectSettings/>}/>
      </Route>
      <Route path='/profile-details' element={<ProtectRoute> <ViewProfile/> </ProtectRoute>}/>
      <Route path='*' Component={()=> <Navigate to='/auth/login'/>}/>
    </Routes>
  );
}

export default App;
