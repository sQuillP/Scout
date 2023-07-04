import { 
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Switch,
    TableContainer,
    Paper,
    Button,
    Modal,
    Box,
    Snackbar,
    Alert,
 } from '@mui/material';

import {
    FilterList,
    Pageview,
    MoreVert,
    Label,
    AddTask,
} from '@mui/icons-material'

import { useNavigate, useParams } from 'react-router-dom'

import "../styles/Tickets.css";
import { useEffect, useState } from 'react';
import CreateTicket from '../components/CreateTicket';

export default function Tickets() {

    const [menuRef, setMenuRef] = useState(null);

    /* state for creating a ticket */
    const [openModal, setOpenModal] = useState(false);


    /* Stateful condition to ask a user if they want to delete ticket */
    const [confirmModal, setConfirmModal] = useState(false);

    /* when user submits/creates a new ticket, dipslay success message in snackbar */
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [selectedTicket, setSelectedTicket] = useState(null);

    const navigateTo = useNavigate();
    const params = useParams();

    /* Apply search fileters when searching for the tickets. */
    const [ticketFilters, setTicketFilters] = useState({});

    const [loadingContent, setLoadingContent] = useState(false);
    const openMenuRef = Boolean(menuRef);
    const [collapseTable, setCollapseTable] = useState(false);


    useEffect(()=> {
        //call api to get all the tickets.
    },[]);

    //set the current selected user 
    function onShowTableMenu(e, entity) {
        setMenuRef(e.currentTarget);
        setSelectedTicket(entity);
    }

    function handleMenuAction(path) {
        navigateTo(path);
        onCloseMenu();
        return;
    }

    function onCloseMenu() {
        setMenuRef(null);
        setSelectedTicket(null);
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

    function onCancelTicket(cancel) {
        if(cancel) {
            setOpenModal(false);
        }
        setConfirmModal(false);
    }

    return (
        <div className="tickets-main">
            <Modal
                open={openModal}
                onClose={()=> setConfirmModal(true)}
            >
                <>
                    <CreateTicket
                        onCloseTicketForm={(submitted)=>{ 
                            if(!submitted)
                                setConfirmModal(true);
                            else {
                                setOpenSnackbar(true);
                                setOpenModal(false);
                            }
                        }}
                    />
                </>
            </Modal>
            <Modal 
                open={confirmModal}
                onClose={()=> setConfirmModal(false)}
            >
                <Box  maxWidth={'550px'} sx={{margin:'30vh auto 0 auto'}}>
                    <Paper sx={{padding: '25px'}} elevation={10}>
                        <Typography align='center' sx={{fontSize:'2rem', paddingBottom:'10px', marginBottom:'10px', borderBottom:'1px solid lightgray'}}>Delete this ticket?</Typography>
                        <Typography align='center' variant="body1">All ticket information cannot be recovered.</Typography>
                        <Stack direction={'row'} marginTop={'20px'} justifyContent={'center'} spacing={1}>
                            <Button sx={{textTransform:'unset'}} onClick={()=> onCancelTicket(false)} variant='outlined' color="error">Cancel</Button>
                            <Button sx={{textTransform:'unset'}} onClick={()=> onCancelTicket(true)} variant="outlined">Delete ticket</Button>
                        </Stack>
                    </Paper>
                </Box>
            </Modal>
            <Snackbar
                open={openSnackbar}
                onClose={()=> setOpenSnackbar(false)}
                autoHideDuration={3500}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Alert severity="success" sx={{ width: '100%', display:'flex', alignItems:'center' }}>
                    <Typography variant='body1' fontSize={'1.2rem'}>Ticket has been successfully created!</Typography>
                </Alert>
            </Snackbar>
            <Menu
                open={openMenuRef}
                anchorEl={menuRef}
                onClose={onCloseMenu}
            >
                <MenuItem onClick={()=>onCloseMenu()}>
                    Re-open ticket
                </MenuItem>
                <MenuItem onClick={()=> handleMenuAction(`/projects/${params.projectId}/tickets/${selectedTicket.id}`)}>
                    View Ticket
                </MenuItem>
            </Menu>
            <div className="tickets-title">
                <div className="page-title">
                    <p className="text tickets-title">Tickets for Ezer</p>
                </div>
            </div>
            <div className="tickets-filter-section">
                <Button sx={{
                    margin: '0px 20px', 
                    padding:'5px 10px', 
                    textTransform:'unset', 
                    background:'var(--darkest-blue)',
                    fontWeight:'bold'
                }} 
                    size='small'  
                    variant='contained'
                    onClick={()=> setOpenModal(true)}
                    
                >Create New Ticket</Button>
                <div className="tickets-filter-options">
                    <Typography fontSize={'1.2rem'} variant='body1'>Filter Tickets</Typography>
                    <Tooltip title='Apply Filters'>
                        <IconButton sx={{marginLeft:'10px'}}>
                            <FilterList/>
                        </IconButton>
                    </Tooltip>
                    <Typography marginLeft={'10px'}>Collapse</Typography>
                    <Switch onChange={(e)=> setCollapseTable((collapsed)=> !collapsed)} color='success'/>
                </div>
            </div>
            <div className="tickets-table-section">
                <TableContainer component={Paper}>
                    <Table size={collapseTable?'small':'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Typography>Please fix this issue</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Jan Johnson</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label='closed' color='default'/>
                                </TableCell>
                                <TableCell>
                                    <Chip label={'high'} color={getPriorityColor('high')}/>
                                </TableCell>
                                <TableCell>
                                    <Stack direction='row' alignItems={'center'}>
                                        <Tooltip title='options'>
                                            <IconButton onClick={(e)=>onShowTableMenu(e,'some id')}>
                                                <MoreVert/>
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}