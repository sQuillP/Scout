import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    token: null,
    loading: false,
    user: null,
    
};


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        signIn(state,action) {
            state.token = action.payload;
        },
        signOut(state,action) {
            state.token = null;
        }
    }
});

export default authSlice.reducer;
export const {signIn, signOut }  = authSlice.actions;