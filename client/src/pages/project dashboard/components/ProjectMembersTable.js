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
} from "@mui/material";
import { memberRows } from "../dev/dummy_data";
import { useState } from "react";


export default function ProjectMembersTable() {

    const memberHeaders = ['Name', 'Email', 'Role'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(10);

    function onHandleUpdateRole() {

    }

    function handleRowsChange(e) {
        setRowsPerPage( parseInt(e.target.value,10) );
    }

    function handlePageChange(e, newPage) {
        setCurrentPage( newPage );

    }


    return (
        <>
            <TableContainer sx={{borderRadius:0}} component={Paper}>
                <Table sx={{ margin:'0 auto'}}>
                    <TableHead>
                        <TableRow>
                            {memberHeaders.map((header)=>(<TableCell key={header}>{header}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberRows.map((member)=> {
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
                                    <TableCell>
                                        { true ?(
                                            <select defaultValue={'developer'} onChange={onHandleUpdateRole}>
                                                <option value={'developer'}>Developer</option>
                                                <option value="pm">Project Manager</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        ): member.role}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={100}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsChange}
            />
        </>
    )
}