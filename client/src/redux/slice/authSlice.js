import { createSlice } from '@reduxjs/toolkit';
import { login, signup } from '../thunk/auth';
import decode from 'jwt-decode';

const initialState = {
    authToken: null,
    loading: false,
    user: null,
};


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        loginFromStoredToken(state,action) {
            let fetchedToken = localStorage.getItem('token');
            
            if(fetchedToken !== null) {
                const decodedToken = decode(fetchedToken);
                const expDate = new Date(decodedToken.exp).getTime() * 1000;
                if(expDate <  Date.now())//if expDate had already happened
                    fetchedToken = null;
            }
            state.authToken = fetchedToken;
        },
        logout(state,action) {
            state.authToken = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder)=> {

        //for signing in
        builder.addCase(login.fulfilled,(state,{payload})=> {
            state.authToken = payload;
            localStorage.setItem('token',payload);
        });


        //for signing up
        builder.addCase(signup.fulfilled,(state,{payload})=> {
            state.authToken = payload;
            localStorage.setItem('token',payload);
        });
    }
});



export default authSlice.reducer;
export const {loginFromStoredToken, logout }  = authSlice.actions;