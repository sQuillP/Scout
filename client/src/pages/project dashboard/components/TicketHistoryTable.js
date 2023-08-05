import { useEffect, useRef, useState } from "react";

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

import Scout from "../../../axios/scout";
import { useSelector } from "react-redux";

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

    
    const currentProject = useSelector((store)=> store.project.currentProject);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingTicketHistory, setLoadingTicketHistory] = useState(false);
    const [loadingTicketError, setLoadingTicketError] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [ticketHistoryCount, setTicketHistoryCount] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const mountedRef = useRef(true);

    const PAGE_LIMIT = 5;

    useEffect(()=> {
        fetchTicketHistory({page: currentPage, limit: PAGE_LIMIT});
        return ()=> mountedRef.current = false;
    },[ticketId]);


    async function fetchTicketHistory(params) {
        mountedRef.current = true;
        setLoadingTicketHistory(true);
        try{
            const historyResponse = await Scout.get('/projects/myProjects/'+currentProject._id+'/tickets/'+ticketId+'/ticketHistory',{params});
            if(mountedRef.current === false) return;
            setTicketHistory(historyResponse.data.data);
            console.log(historyResponse.data);
            setTicketHistoryCount(historyResponse.data.itemCount || 0);
            setLoadingTicketHistory(false);
        } catch(error) {
            setShowSnackbar(true);
            console.log(error, error.message);
        }
    }


    function onDismissSnackbar() {
        setShowSnackbar(false);
    }

    async function handlePageChange(_,page) {
        setCurrentPage((page+1));
        await fetchTicketHistory({page: (page+1), limit: PAGE_LIMIT});
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
                                    ticketHistory.map((historyItem)=> {
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
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <Avatar 
                                                            src={historyItem.modifiedBy.profileImage}
                                                            alt={historyItem.modifiedBy.email[0].toUpperCase()}
                                                            sx={{}}
                                                        />
                                                        <p  className="text">
                                                            {historyItem.modifiedBy.firstName + " " + historyItem.modifiedBy.lastName}
                                                        </p>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {historyItem.description}
                                                </TableCell>
                                                <TableCell>
                                                    {historyItem.updatedAt}
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
                            onClick={fetchTicketHistory}
                        >Click to Refresh</Button>
                    </Stack>
                    
                )
            }

            { !loadingTicketError && !loadingTicketHistory && (
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    rowsPerPage={ticketHistory.length}
                    page={currentPage-1}
                    onPageChange={handlePageChange}
                    count={ticketHistoryCount}
                />
                )
            }
        </Paper>
    )
}