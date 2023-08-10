import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Snackbar,
    Alert,
    Avatar,
    Typography,
    Stack,
    Tooltip,
    IconButton,
    TableContainer
} from '@mui/material';

import {
    DeleteSharp,
} from '@mui/icons-material'

import { useState, useEffect, useRef } from 'react';

import Scout from '../../../axios/scout';


export default function ManageInviteTable(){

    const [currentPage, setCurrentPage] = useState(1);
    const [queryLimit, setQueryLimit] = useState(5);

    const [totalItems, setTotalItems] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const [invitations, setInvitations] = useState([]);

    const mounted = useRef(true);

    useEffect(()=> {
        
        fetchInvitations({page: currentPage, limit: queryLimit });

        return ()=> mounted.current = false;
    },[]);

    async function handlePageChange(_, newPage) {
        //handle page change
        //api request
        const query = {page: newPage+1, limit: queryLimit};
        // await fetchInvitations(query);
        setCurrentPage(newPage+1);
    }


    async function fetchInvitations(query) {
        try{
            const responseData = await Scout.get('/invite',{params:query});
            if(mounted.current === false) return;
            setInvitations(responseData.data);
            setTotalItems(responseData.data.totalItems);
        } catch(error) {
            onOpenSnackbar("Unable to fetch invitations", "error");
        }
    }


    async function onRemoveInvite(_id){
        try{
            const deletedInvite = invitations.find((invite)=> invite._id === _id)
            const responseData = await Scout.delete('/invite',{invitation: deletedInvite._id});
            if(mounted.current === false) return;
            setInvitations(responseData.data.data);
            setCurrentPage(1);

        } catch(error) {
            onOpenSnackbar("Unable to delete invitation", "error");
        }
    }


    function onOpenSnackbar(message, severity){
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    }

    return (
        <>
            <Snackbar
                open={openSnackbar}
                onClose={()=> setOpenSnackbar(false)}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
                autoHideDuration={2000}
            >
                <Alert severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <div className="mit-container">
            <TableContainer>

                <Table>
                    <TableHead>
                        <TableRow>

                            <TableCell>
                                User
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            invitations.map((invite)=> {
                                <TableRow key={invite._id}>
                                    <TableCell>
                                        <Avatar>
                                            {invite.user.firstName + " " + invite.user.lastName}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>Awaiting confirmation</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            direction={'row'}
                                            gap={1}
                                        >
                                            <Tooltip title='Delete person'>
                                                <IconButton onClick={onRemoveInvite}>
                                                    {/* icon */}
                                                    <DeleteSharp/>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            })
                        }

                    </TableBody>
                </Table>
                <TablePagination
                    count={totalItems}
                    page={currentPage-1}
                    onPageChange={()=> handlePageChange}
                    rowsPerPage={10}
                />
            </TableContainer>

            </div>
        </>
    )
}