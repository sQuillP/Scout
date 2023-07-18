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
    Chip,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
} from "@mui/material";

import { activityRows } from "../dev/dummy_data";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";



export default function RecentTicketsTable() {

    const activityHeaders = ['Title','Created By', 'Status','Priority', 'Actions'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(10);

    const [menuRef, setMenuRef] = useState(null);

    const openMenu = Boolean(menuRef);

    function onHandlePageChange(e,newPage) {
        setCurrentPage(newPage);
    }


    function onHandleRowChange(e) {
        setRowsPerPage( parseInt(e.target.value,10) );

    }

    function onViewTicket(){
        //view the ticket logic
        setMenuRef(null);
        navigate('/projects/asdf/tickets/exampleticket');
    }

    function onOpenMenu(e) {
        setMenuRef(e.currentTarget)
    }

    function getPriorityColor(priority) {
        switch(priority){
            case "high":
                return 'error';
            case "medium":
                return "warning";
            case "low":
                return "success";
        }
    }

    return (
        <>
            <Menu
                open={openMenu}
                anchorEl={menuRef}
                // anchorOrigin={{horizontal:'center', vertical:'bottom'}}
                onClose={()=> setMenuRef(null)}
            >
                <MenuItem
                    onClick={onViewTicket}
                >
                    View Ticket
                </MenuItem>
            </Menu>
            <TableContainer component={Paper}>
                <Table sx={{margin:'0 auto'}}>
                    <TableHead>
                        <TableRow>
                            {activityHeaders.map((activityHeader)=><TableCell key={activityHeader}>{activityHeader}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activityRows.map((activityRow)=> {
                            return (
                                <TableRow
                                    key={activityRow.id}
                                >
                                    <TableCell>
                                        {activityRow.title}
                                    </TableCell>
                                    <TableCell>
                                        <div className="avatar-wrapper">
                                            <Avatar sx={avatarSX}>
                                                {activityRow.createdBy[0]}
                                            </Avatar>
                                            {activityRow.createdBy}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {activityRow.status}
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="small" label={activityRow.priority} color={getPriorityColor(activityRow.priority)}/>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={onOpenMenu}>
                                            <MoreVert/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={onHandlePageChange}
                onRowsPerPageChange={onHandleRowChange}
            />
        </>
    )
}