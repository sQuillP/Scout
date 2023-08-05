import { createSlice } from "@reduxjs/toolkit";
import { getProjectById } from "../thunk/project";


const initialState = {
    currentProject: null,
    loadingCurrentProject:true,
    loadCurrentProjectFailure: false,
    role: null,
};


const projectSlice = createSlice({
    name:'project',
    initialState,

    reducers: {
        updateProjectSync(state, {payload}){
            console.log(payload)
            state.currentProject = payload;
            state.role = payload.userPermission.role;
        },
        clearLoadingErrors(state,_) {
            state.loadCurrentProjectFailure = false;
        }
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

        builder.addCase(getProjectById.rejected, (state,_)=> {
            state.loadCurrentProjectFailure = true;
            state.loadingCurrentProject = false;
            console.log('rejected')
        });
    }
});


export default projectSlice.reducer;

export const { updateProjectSync, clearLoadingErrors } = projectSlice.actions;