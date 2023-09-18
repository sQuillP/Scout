import { createSlice } from '@reduxjs/toolkit';
import decode from 'jwt-decode';

const initialState = {
    authToken: null,
    loading: false,
    user: null,
    tokenExp: null,
};




const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        //fetch stored token, if not expired, set the authToken to the fetched token.
        //
        loginFromStoredToken(state,action) {
            let fetchedToken = localStorage.getItem('token');
            try {
                if(fetchedToken !== null) {
                    const decodedToken = decode(fetchedToken);
                    const expDate = new Date(decodedToken.exp*1000).getTime();
                    state.tokenExp = expDate;
                    if(expDate <  Date.now())//if expDate had already happened
                        fetchedToken = null;
                }
            } catch(error) {//error parsing the token
                localStorage.removeItem('token');
            }
            state.authToken = fetchedToken;
        },

        logout(state,action) {
            state.authToken = null;
            localStorage.removeItem('token');
        },
        updateUserSync(state,action) {
            state.user = {...state.user, ...action.payload};
        }
    },
    extraReducers: (builder)=> {

       
    }
});



export default authSlice.reducer;
export const {loginFromStoredToken, logout, updateUserSync }  = authSlice.actions;