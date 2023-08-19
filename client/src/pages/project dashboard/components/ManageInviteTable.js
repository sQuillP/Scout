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
    TableContainer,
    TableFooter
} from '@mui/material';

import {
    DeleteSharp,
} from '@mui/icons-material'

import { useState, useEffect, useRef } from 'react';

import Scout from '../../../axios/scout';
import EmptyTable from './EmptyTable';
import { useParams } from 'react-router-dom';


export default function ManageInviteTable(){

    const [currentPage, setCurrentPage] = useState(1);
    const [queryLimit, setQueryLimit] = useState(5);

    const [totalItems, setTotalItems] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const {projectId} = useParams();
    const [invitations, setInvitations] = useState([]);

    const mounted = useRef(true);

    useEffect(()=> {
        mounted.current = true;
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
            mounted.current = true;
            const responseData = await Scout.get('/invite/'+projectId,{params:query});
            console.log(responseData.data);
            if(mounted.current === false) return;
            setInvitations(responseData.data.data);
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
            console.log(responseData.data.data);
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

    console.log(invitations);

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
            {
                invitations.length !== 0 && (
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
                                    return (
                                        <TableRow key={invite._id}>
                                            <TableCell>
                                                <Stack
                                                    gap={1}
                                                    direction={'row'}
                                                    alignItems={'center'}
                                                >
                                                    <Avatar>
                                                        {invite.user.firstName[0]+invite.user.lastName[0]}
                                                    </Avatar>
                                                    <Typography>{invite.user.firstName + " " + invite.user.lastName}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>Awaiting confirmation</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack
                                                    direction={'row'}
                                                    gap={1}
                                                >
                                                    <Tooltip title='Delete invite'>
                                                        <IconButton size='medium' onClick={()=> onRemoveInvite(invite._id)}>
                                                            <DeleteSharp/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                    </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    count={totalItems}
                                    page={currentPage-1}
                                    onPageChange={()=> handlePageChange}
                                    rowsPerPage={10}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                )
            }
            {
                invitations.length === 0 && (
                    <EmptyTable
                        message='Looks like there are no invites'
                    />
                )
            }
            </div>
        </>
    )
}