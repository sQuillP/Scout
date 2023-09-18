import { createAsyncThunk } from '@reduxjs/toolkit';
import Scout from '../../axios/scout';


/**
 * @description - store fetched project in redux store
 * @param {string} - object id of the project
 */
export const getProjectById = createAsyncThunk(
    "project/getProjectById",
    async (projectId,{getState, dispatch, rejectWithValue})=> {
        try {
            const response = await Scout.get('/projects/myProjects/'+projectId);
            return response.data.data
        } catch(error) {
            console.log(error.message);
            return rejectWithValue(null);
        }
    }
);


