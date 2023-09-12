import { createSlice } from '@reduxjs/toolkit';
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
        //fetch stored token, if not expired, set the authToken to the fetched token.
        //
        loginFromStoredToken(state,action) {
            let fetchedToken = localStorage.getItem('token');
            
            if(fetchedToken !== null) {
                const decodedToken = decode(fetchedToken);
                console.log(decodedToken);
                const expDate = new Date(decodedToken.exp*1000).getTime();
                if(expDate <  Date.now())//if expDate had already happened
                    fetchedToken = null;
                state.user = decodedToken;
            }
            state.authToken = fetchedToken;
        },
        logout(state,action) {
            state.authToken = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder)=> {

       
    }
});



export default authSlice.reducer;
export const {loginFromStoredToken, logout }  = authSlice.actions;