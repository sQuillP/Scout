import { createAsyncThunk } from '@reduxjs/toolkit';
import Scout from '../../axios/scout';


export const getProjectById = createAsyncThunk(
    "project/getProjectById",
    async (projectId,{getState, dispatch, rejectWithValue})=> {
        try {
            console.log('fetching another project since params changed')
            const response = await Scout.get('/projects/'+projectId);
            console.log(response.data);
            return response.data.data
        } catch(error) {
            return rejectWithValue(null);
        }
    }
)


