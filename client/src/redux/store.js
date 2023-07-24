import { configureStore} from '@reduxjs/toolkit'
import authSlice from './slice/authSlice';
import projectSlice from './slice/projectSlice';



const store= configureStore({
    reducer:{
        auth: authSlice,
        project: projectSlice,
    }
});


export default store;


