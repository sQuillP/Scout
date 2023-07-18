
import HorizontalNavigation from "../../../components/HorizontalNavigation";
import ProjectMembersTable from "../components/ProjectMembersTable";
import VerticalNavigation from "../components/VerticalNavigation";
import{ 
    CircularProgress,
    Snackbar,
    Paper, 
    Stack, 
    Typography,
    Box,
    debounce,
    IconButton, 
    Menu,
    MenuItem,
    Tooltip,
    Chip
 }from "@mui/material";
 import {
    CheckCircleOutline,
    FilterAlt
 } from '@mui/icons-material'
import useDebounce from '../../../hooks/useDebounce';
import axios from 'axios';
import "../styles/Members.css";
import UserSearchResult from "../components/UserSearchResult";
import { useEffect, useRef, useState } from "react";
export default function Members() {

    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [menuRef, setMenuRef] = useState(null);
    const [filterBy, setFilterBy] = useState('name'); //field should either be name or email

    const openMenuRef = !!menuRef;

    const debouncedTerm = useDebounce(searchUserTerm,1000);


    /* add loading animation when user types into the keyboard. */
    useEffect(()=> {
        setLoadingUsers(false);
        if(debouncedTerm.trim() === '') return;
    },[debouncedTerm])


    function handleSearchUserTerm(e) {
        if(e.target.value?.trim() !== ''){
            setLoadingUsers(true);
        }
        setSearchUserTerm(e.target.value);
    }

    function onHandleInvite() {
        //async code to invite user to app.
        setSnackbarOpen(true);
    }

    function onChooseSearchFilter(filter){
        setFilterBy(filter);
        onCloseMenu();
    }

    function onCloseMenu() {
        setMenuRef(null);
    }

    return (
        <div className="mem-container">
            <Menu
                open={openMenuRef}
                onClose={onCloseMenu}
                anchorEl={menuRef}
            >
                <MenuItem onClick={()=>onChooseSearchFilter('name')}>Search by name</MenuItem>
                <MenuItem onClick={()=>onChooseSearchFilter('email')}>Search by email</MenuItem>
            </Menu>
            <Snackbar 
                open={snackbarOpen}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
                autoHideDuration={2000}
                onClose={()=> setSnackbarOpen((current)=> current=false)}
            >
                <Paper elevation={5} sx={{padding:'15px 20px'}}>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography marginRight={'1rem'}>Invite has been sent </Typography>
                        <CheckCircleOutline sx={{fontSize:'1.5rem'}} color="success"/>
                    </Stack>
                </Paper>
            </Snackbar>
            <div className="mem-section">
                <div className="page-title">
                    <p className="text mem-intro">Manage Users and Roles</p>
                    <p className="text header-desc">
                        You can users to your project as well as modifying other user roles. Remember, only administrators can modify roles.
                    </p>
                    <p className="text header-desc">
                        Please contact any admin of a project if you wish to have higher access privilege.
                    </p>
                </div>
            </div>
            <div className="mem-section">
                <div className="mem-flex-section">
                    <div className="member-col">

                        <div className="input-wrapper">
                            <Stack direction='row' justifyContent={'center'} alignItems={'center'}>
                                <label className="mem-add-label" htmlFor="_mem-add-member">Invite New Members</label>
                                <Tooltip title='Filter settings'>
                                    <IconButton sx={{marginLeft:'5px'}} size='medium' onClick={(e)=> setMenuRef(e.currentTarget)}>
                                        <FilterAlt sx={{fontSize: '1.2rem'}}/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <input 
                                onChange={handleSearchUserTerm} 
                                id="_mem-add-member" 
                                type="text" 
                                className="mem-add-member"
                                value={searchUserTerm}
                                autoComplete="off"
                            />
                            <i className="mem-input-icon fa-solid fa-user-plus"></i>
                            <Chip sx={{fontSize:'0.7rem', padding:'5px 0', height: 'auto'}} label={"Searching by: " + filterBy} variant="filled"/>
                        </div>
                        <div className="mem-search-result-container">
                           { 
                                loadingUsers?(
                                    <>
                                        <Box height={'200px'} display={'flex'} width='100%' justifyContent={'center'} alignItems='center'>
                                            <CircularProgress/>
                                        </Box>
                                    </>
                                ):(
                                    <>
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                        <UserSearchResult
                                            handleInvite={onHandleInvite}
                                        />
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div style={{width: '100%'}} className="member-col">
                        <ProjectMembersTable
                            showActions={true}
                            sx={{width:'100%'}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}