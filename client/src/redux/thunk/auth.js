import { createAsyncThunk } from "@reduxjs/toolkit";
import Scout from "../../axios/scout";



export const login = createAsyncThunk(
    "auth/login",
    async (payload,{rejectWithValue})=> {
        try {
            const result = await Scout.post('/auth/login',payload);
            console.log(result.data);
            return result.data.token;
        } catch(error) {
            return rejectWithValue(null);
        }
    }
);



export const signup = createAsyncThunk(
    "auth/signup",
    async (signupBody, {rejectWithValue})=> {
        try {
            const result = await Scout.post('/auth/signup', signupBody);
            console.log(result.data.data);
            return result.data.token;
        } catch(error){
            return rejectWithValue(null);
        }
    }
);