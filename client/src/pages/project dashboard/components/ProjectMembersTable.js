import { 
    Typography,
    TableContainer, 
    Table,
    TableHead,
    TableBody,
    TableRow,
    TablePagination,
    TableCell,
    Paper,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Button,
    Tooltip,
    Snackbar,
    Alert
} from "@mui/material";

import {
    Publish,
} from '@mui/icons-material'

import MenuList from "./MenuList";
// import { memberRows } from "../dev/dummy_data";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { updateProjectSync } from "../../../redux/slice/projectSlice";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from "react-redux";
import { canEditUserPermissions } from "../../../util/permissions";
import EmptyTable from "./EmptyTable";
import { useParams} from 'react-router-dom'
import Scout from "../../../axios/scout";



//YOU left off with changing permissions for users.
export default function ProjectMembersTable({showActions = false, containerSX = {}}) {

    /* Component meta */
    const memberHeaders = ['Name', 'Email', 'Role'];
    const menuOptions = ['Remove'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};

    /* Redux project information */
    const { role } = useSelector((store)=> store.project);
    const project = useSelector((store)=> store.project.currentProject);
    const dispatch = useDispatch();

    const {projectId} = useParams();

    /* member permissions object */
    const [memberPermissions, setMemberPermissions] = useState({});
    const [updatedMemberPermission, setUpdatedMemberPermission] = useState(false);

    /* snackbar */
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    /* pagination */
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(10);

    /* menu config */
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(-1);


    useEffect(()=> {
        if(project === null) return;

        let initialPermissionsState = {};
        for(const member of project.members)
            initialPermissionsState[`${member._id}`] = member.role;

        setMemberPermissions(initialPermissionsState);
    },[project]);

    

    function onHandleUpdateRole(value, userId) {
        if(Object.keys(memberPermissions).length === 0) return;

        const updatedMemberPermissions = {
            ...memberPermissions,
            [userId]:value
        };
        let didUpdatePermission = false;
        for(const member of project.members){
            if(updatedMemberPermissions[member._id] !== member.role)
                didUpdatePermission = true;
        }
        setUpdatedMemberPermission(didUpdatePermission);//set boolean to allow user to submit changes.
        setMemberPermissions(updatedMemberPermissions);
    }

    function handleRowsChange(e) {
        setRowsPerPage( parseInt(e.target.value,10) );
    }

    function handlePageChange(e, newPage) {
        console.log(newPage)
        setCurrentPage( newPage );

    }

    //open menu, set the index of the row that was selected
    function onHandleOpenMenu(e, index) {
        setAnchorEl(e.currentTarget);
        setSelectedRow(index);
    }

    //close menu and handle any data changes if necessary
    function handleCloseMenu(clickedOption) {
        if(clickedOption === "Remove") {//remove the selected member to be removed.
            // const updatedMembers = members.filter((row,i)=> i !== selectedRow);
            // setMembers(updatedMembers);
        }
        setAnchorEl(null);   
        setSelectedRow(-1);
    }


    async function onRemoveMember() {

    }



    async function onSavePermissionChanges() {
        try {
            const memberPayload = [];
            for(const memberId of Object.keys(memberPermissions)){
                memberPayload.push({
                    _id: memberId,
                    role: memberPermissions[memberId]
                });
            }
            const response = await Scout.put(
                "/projects/myProjects/"+projectId+"/members",
                {members: memberPayload}
            );

            dispatch(updateProjectSync(response.data.data));
            setUpdatedMemberPermission(false);
            onOpenSnackbar("Permissions successfully updated","success");
        } catch(error) {
            console.log(error, error.message);
            onOpenSnackbar("Unable to save permission modifications", "error");
        }
    }


    function onOpenSnackbar(message, severity) {
        setSnackbarOpen(true);
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    }

    function onCloseSnackbar(){
        setSnackbarOpen(false);
    }

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                onClose={onCloseSnackbar}
                anchorOrigin={{vertical:'bottom', horizontal:'center'}}
                autoHideDuration={2000}
            >
                <Alert severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {showActions && <MenuList onClose={handleCloseMenu} anchorEl={anchorEl} menuItems={['Remove']}/>}
            {
                project !== null && project.members.length !== 0 &&(
                <TableContainer sx={{borderRadius:'0 0 5px 5px'}} component={Paper}>
                    <Table sx={{ margin:'0 auto', ...containerSX}}>
                        <TableHead>
                            <TableRow>
                                {
                                    memberHeaders.map((header)=>{
                                        return (
                                            <TableCell align={header === 'Role' && !showActions?'right':'left'} key={header}>
                                                {header}
                                            </TableCell>
                                        );
                                    })
                                }
                                {
                                    showActions === true && (
                                        <TableCell align="right">
                                            Actions
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {project.members.map((member, index)=> {
                                return (
                                    <TableRow key={member._id}>
                                        <TableCell>
                                            <div className="avatar-wrapper"
                                            >
                                                <Avatar
                                                    sx={avatarSX}
                                                >
                                                    {member.firstName[0].toUpperCase() + member.lastName[0].toUpperCase()}
                                                </Avatar>
                                                {member.firstName + " " + member.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {member.email}
                                        </TableCell>
                                        <TableCell align="right">
                                            { canEditUserPermissions(role) ?(
                                                <select 
                                                    onChange={(e)=>onHandleUpdateRole(e.target.value, member._id)}
                                                    value={memberPermissions[member._id] || 'loading'}
                                                    disabled={Object.keys(memberPermissions).length === 0}
                                                >
                                                    <option value={'developer'}>Developer</option>
                                                    <option value="project_manager">Project Manager</option>
                                                    <option value="administrator">Administrator</option>
                                                </select>
                                            ): member.role}
                                        </TableCell>
                                        {showActions === true && (
                                            <TableCell align="right">
                                                <IconButton onClick={(e)=>onHandleOpenMenu(e,index)}>
                                                    <MoreVertIcon/>
                                                </IconButton>
                                            </TableCell>)}
                                    </TableRow>
                                );
                            }).slice((currentPage)*rowsPerPage,(currentPage)*rowsPerPage + rowsPerPage)//slice() will provide pagination
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                )
            }
            {
                project === null || project.members.length === 0 && (
                    <EmptyTable
                        message="No project member data available"
                    />
                )
            }
            <Stack
                direction={'row'}
                gap={2}
                justifyContent={'flex-end'}
                alignItems={'center'}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={(()=> {
                        if(project === null) return 0;
                        return project.members.length;
                    })()}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsChange}
                />
                <Tooltip title="Save changes">
                    <IconButton
                        disabled={canEditUserPermissions(role) === false || updatedMemberPermission === false}
                        sx={{
                            height:'35px',
                            width:'35px'
                        }}
                        onClick={onSavePermissionChanges}
                    >
                        <Publish/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </>
    )
}