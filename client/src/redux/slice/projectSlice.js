import { createSlice } from "@reduxjs/toolkit";
import { getProjectById } from "../thunk/project";


const initialState = {
    currentProject: null,
    loadingCurrentProject:true,
    loadCurrentProjectFailure: false,
    role: null,
    notifications:[]
};


const projectSlice = createSlice({
    name:'project',
    initialState,

    reducers: {

        //use this method for synchronous updates, usually aftera response object dealing with project properties
        updateProjectSync(state, {payload}){
            state.currentProject = payload;
            state.role = payload.userPermission.role;
        },
        clearLoadingErrors(state,_) {
            state.loadCurrentProjectFailure = false;
        },

        /* Add a notification. Used for sockets. */
        pushNotification(state, {payload}) {
            state.notifications.push(payload);
        },

        /* Set the notifications to a new array of notifications. Use this for 
        sending GET and POST requests to the server when logging in*/
        setNotifications(state, {payload}) {
            state.notifications = payload;
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
        });
    }
});


export default projectSlice.reducer;

export const { 
    updateProjectSync, 
    clearLoadingErrors, 
    pushNotification, 
    setNotifications 
} = projectSlice.actions;