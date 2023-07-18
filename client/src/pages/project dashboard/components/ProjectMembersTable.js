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
import { memberRows } from "../dev/dummy_data";
import { useEffect, useState } from "react";

import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ProjectMembersTable({showActions = false, containerSX = {}}) {

    const memberHeaders = ['Name', 'Email', 'Role'];
    const menuOptions = ['Remove'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};

    const [members, setMembers] = useState(memberRows);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(10);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(-1);


    function onHandleUpdateRole() {

    }

    function handleRowsChange(e) {
        setRowsPerPage( parseInt(e.target.value,10) );
    }

    function handlePageChange(e, newPage) {
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
            const updatedMembers = members.filter((row,i)=> i !== selectedRow);
            setMembers(updatedMembers);
        }
        setAnchorEl(null);   
        setSelectedRow(-1);
    }


    return (
        <>
            {showActions && <MenuList onClose={handleCloseMenu} anchorEl={anchorEl} menuItems={['Remove']}/>}
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
                        {members.map((member, index)=> {
                            return (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="avatar-wrapper"
                                        >
                                            <Avatar
                                                sx={avatarSX}
                                            >
                                                {member.name[0]}
                                            </Avatar>
                                            {member.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.email}
                                    </TableCell>
                                    <TableCell align="right">
                                        { true ?(
                                            <select 
                                                defaultValue={'developer'} 
                                                onChange={onHandleUpdateRole}
                                            >
                                                <option value={'developer'}>Developer</option>
                                                <option value="pm">Project Manager</option>
                                                <option value="admin">Administrator</option>
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
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                direction={'row'}
                gap={2}
                justifyContent={'flex-end'}
                alignItems={'center'}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={100}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsChange}
                />
                <Tooltip title="Save changes">
                    <IconButton
                        disabled
                        sx={{
                            height:'35px',
                            width:'35px'
                        }}
                    >
                        <Publish/>
                    </IconButton>
                </Tooltip>

            </Stack>
        </>
    )
}