import { useEffect, useState } from "react";

import { 
    Avatar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, 
    TableHead, 
    TableRow,
    Paper,
    TablePagination,
    CircularProgress,
    Typography,
    Button,
    Snackbar,
    Alert,
 } from '@mui/material';

import {
    SignalWifiStatusbarConnectedNoInternet4
} from '@mui/icons-material';

const dummy_data = [
    {
        //should be the user object
        modifiedBy: {
            username:'williamPattison',
            email:'will.m.pattison@gmail.com',
            image:'none',
        },
        description:'Pariatur veniam deserunt cillum esse fugiat elit sunt aute eu mollit in eu cupidatat est.',
        modifiedDate:'02/26/1999',
        _id:1
    },
    {
        //should be the user object
        modifiedBy: {
            username:'williamPattison',
            email:'will.m.pattison@gmail.com',
            image:'none',
        },
        description:'Pariatur veniam deserunt cillum esse fugiat elit sunt aute eu mollit in eu cupidatat est.',
        modifiedDate:'02/26/1999',
        _id:2
    },
    {
        //should be the user object
        modifiedBy: {
            username:'williamPattison',
            email:'will.m.pattison@gmail.com',
            image:'none',
        },
        description:'Pariatur veniam deserunt cillum esse fugiat elit sunt aute eu mollit in eu cupidatat est.',
        modifiedDate:'02/26/1999',
        _id:3
    },
    {
        //should be the user object
        modifiedBy: {
            username:'williamPattison',
            email:'will.m.pattison@gmail.com',
            image:'none',
        },
        description:'Pariatur veniam deserunt cillum esse fugiat elit sunt aute eu mollit in eu cupidatat est.',
        modifiedDate:'02/26/1999',
        _id:4
    },
    {
        //should be the user object
        modifiedBy: {
            username:'williamPattison',
            email:'will.m.pattison@gmail.com',
            image:'none',
        },
        description:'Pariatur veniam deserunt cillum esse fugiat elit sunt aute eu mollit in eu cupidatat est.',
        modifiedDate:'02/26/1999',
        _id:5
    },

]


/**
 * @description - Will fetch the latest ticket history for a given ticket.
 * 
 * NOTE: Fix state when there is data to display, as in, if there is data, display it?
 */
export default function TicketHistoryTable({ticketId, }) {

    useEffect(()=> {
        //make async request to get ticket history given the ticket id.

        //for ui testing purposes 
        const debugTimeout = setTimeout(()=> {
            //clear loading
            setLoadingTicketHistory(false);
            setShowSnackbar(true);
        
        },3000);

        return ()=> clearTimeout(debugTimeout);
        //**** 
    },[ticketId]);

    const [currentPage, setCurrentPage] = useState(0);

    const [loadingTicketHistory, setLoadingTicketHistory] = useState(true);
    const [loadingTicketError, setLoadingTicketError] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [showSnackbar, setShowSnackbar] = useState(false);

    function onDismissSnackbar() {
        setShowSnackbar(false);
    }

    function handlePageChange() {

    }

    function onFetchTicketHistory() {
        //make axios request
        setLoadingTicketHistory(true);
        const timeout = setTimeout(()=> {
            setLoadingTicketHistory(false);
            setLoadingTicketError(false);
        },3000);

    }

    return (
        <Paper 
            elevation={3} 
            sx={{width:'100%'}}
        >
            <Snackbar
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
                open={showSnackbar}
                onClose={onDismissSnackbar}
                autoHideDuration={5000}
            >
                <Alert
                    severity="error"
                    sx={{width:'100%'}}
                >
                    Error retrieving ticket history
                </Alert>
            </Snackbar>
            {
                loadingTicketHistory && (
                    <Stack 
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        spacing={2}
                        sx={{padding:'50px'}}
                    >
                        <CircularProgress/>
                        <Typography>Loading Ticket History</Typography>
                    </Stack>
                )
            }
            {
                !loadingTicketHistory && !loadingTicketError && (
                    <TableContainer>
                        <Table sx={{width:'100%'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Modified By
                                    </TableCell>
                                    <TableCell>
                                        Description
                                    </TableCell>
                                    <TableCell>
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dummy_data.map((historyItem)=> {
                                        return (
                                            <TableRow
                                                key={historyItem._id}
                                            >
                                                <TableCell>
                                                    <Stack 
                                                        direction={'row'} 
                                                        spacing={2} 
                                                        flexWrap={'wrap'}
                                                        alignItems={'center'}
                                                        justifyContent={'center'}
                                                    >
                                                        <Avatar 
                                                            src={historyItem.modifiedBy.image}
                                                            alt={historyItem.modifiedBy.email[0].toUpperCase()}
                                                            sx={{}}
                                                        />
                                                        <p className="text">
                                                            {historyItem.modifiedBy.username}
                                                        </p>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {historyItem.description}
                                                </TableCell>
                                                <TableCell>
                                                    {historyItem.modifiedDate}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>

                    </TableContainer>
                )
            }
            {
                loadingTicketError && !loadingTicketHistory && (
                    <Stack
                        direction={'column'}
                        spacing={2}
                        alignItems={'center'}
                        justifyContent={'center'}
                        padding={'30px 0px'}
                    >
                        <SignalWifiStatusbarConnectedNoInternet4
                            sx={{
                                color:'gray',
                                fontSize:'3rem'
                            }}
                        />
                        <Typography>Unable to Get Ticket History</Typography>
                        <Button
                            sx={{
                                textTransform:'none'
                            }}
                            //variant
                            onClick={onFetchTicketHistory}
                        >Click to Refresh</Button>
                    </Stack>
                    
                )
            }

            { !loadingTicketError && !loadingTicketHistory && (
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    count={dummy_data.length}
                />
                )
            }
        </Paper>
    )
}