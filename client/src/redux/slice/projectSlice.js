import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentProject: null,
    
};


const projectSlice = createSlice({
    name:'project',
    initialState,

})