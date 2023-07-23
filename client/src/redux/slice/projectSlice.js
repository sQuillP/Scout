import { createSlice } from "@reduxjs/toolkit";
import { getMyProjects, getProjectById } from "../thunk/project";


const initialState = {
    currentProject: null,
    loadingCurrentProject:false,
};


const projectSlice = createSlice({
    name:'project',
    initialState,

    reducers: {

    },
    extraReducers:(builder)=> {

        builder.addCase(getProjectById.pending,(state)=> {
            state.loadingCurrentProject = true;
        });

        builder.addCase(getProjectById.fulfilled,(state,{payload})=> {
            state.currentProject = payload;
            state.loadingCurrentProject = false;
        });
    }
})