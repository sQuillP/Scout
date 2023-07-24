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
    Tooltip
} from "@mui/material";

import {
    Publish,
} from '@mui/icons-material'

import MenuList from "./MenuList";
// import { memberRows } from "../dev/dummy_data";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from "react-redux";
import { canEditUserPermissions } from "../../../util/permissions";
import EmptyTable from "./EmptyTable";
import Scout from "../../../axios/scout";



//YOU left off with changing permissions for users.
export default function ProjectMembersTable({showActions = false, containerSX = {}}) {

    const memberHeaders = ['Name', 'Email', 'Role'];
    const menuOptions = ['Remove'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};
    const { role } = useSelector((store)=> store.project);
    const project = useSelector((store)=> store.project.currentProject);

    const [memberPermissions, setMemberPermissions] = useState({});
    const [updatedMemberPermission, setUpdatedMemberPermission] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(10);

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

        let didUpdatePermission = false;
        for(const member of project.members){
            if(memberPermissions[member._id].role !== member.role)
                didUpdatePermission = true;
        }
        setUpdatedMemberPermission(didUpdatePermission);
        setMemberPermissions((prevMemberPermissions)=> {
            return {
                ...prevMemberPermissions,
                [userId]:value
            }
        });
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




    async function onSavePermissionChanges() {
        try {
            // await Scout.post()
            console.log(memberPermissions)
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <>
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
                                                    defaultValue={'developer'} 
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
                    <EmptyTable/>
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
                        disabled={!canEditUserPermissions(role) || !updatedMemberPermission}
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