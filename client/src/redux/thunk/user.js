import { createAsyncThunk } from "@reduxjs/toolkit";
import Scout from "../../axios/scout";


export const updateMe = createAsyncThunk('user/updateMe', async (payload, {dispatch, rejectWithValue})=> {
    try {
        const response = await Scout.put('')
    } catch(error){
        return rejectWithValue();
    }
});