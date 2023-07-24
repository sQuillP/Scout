import { createSlice } from "@reduxjs/toolkit";
import { getProjectById } from "../thunk/project";


const initialState = {
    currentProject: null,
    loadingCurrentProject:false,
    role: null,
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
            state.role = payload.userPermission.role;
        });
    }
});


export default projectSlice.reducer;

export const { } = projectSlice.actions;