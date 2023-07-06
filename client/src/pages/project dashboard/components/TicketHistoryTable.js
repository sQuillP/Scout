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
        _id:4
    },

]


/**
 * @description - Will fetch the latest ticket history for a given ticket.
 */
export default function TicketHistoryTable({ticketId, }) {

    useEffect(()=> {
        //make async request to get ticket history given the ticket id.

        //for ui testing purposes 
        const debugTimeout = setTimeout(()=> {
            //clear loading
            setLoadingTicketHistory(false);
        
        },3000);

        return ()=> clearTimeout(debugTimeout);
        //**** 
    },[ticketId]);

    const [currentPage, setCurrentPage] = useState(0);

    const [loadingTicketHistory, setLoadingTicketHistory] = useState(true);
    const [loadingTicketError, setLoadingTicketError] = useState(true);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    function handlePageChange() {

    }

    function onRefresh() {
        //make axios request
    }

    return (
        <Paper 
            elevation={3} 
            // sx={{width:'100%'}}
        >
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
                    <>
                        <SignalWifiStatusbarConnectedNoInternet4/>
                        <Typography>Unable to Get Ticket History</Typography>
                        <Button
                            onClick={onRefresh}
                        >Click to Refresh</Button>
                    </>
                    
                )
            }
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handlePageChange}
                count={dummy_data.length}
            />
        </Paper>
    )
}