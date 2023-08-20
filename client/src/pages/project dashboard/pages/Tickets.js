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
    CircularProgress,
    Checkbox,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Input,
    Autocomplete,
    TextField,
 } from '@mui/material';

import {
    FilterList,
    MoreVert,
    Autorenew,
    ChevronLeft,
    ChevronRight,
    MoodBad,
    Close,

} from '@mui/icons-material'

import { useNavigate, useParams } from 'react-router-dom'

import "../styles/Tickets.css";
import { useEffect, useRef, useState } from 'react';
import CreateTicket from '../components/CreateTicket';
import { useSelector } from 'react-redux';
import Scout from '../../../axios/scout';

export default function Tickets() {


    const project = useSelector((store)=> store.project.currentProject);

    const paperSX = {height:'20vh', flexDirection:'column', justifyContent:'center',display:'flex',alignItems:'center'};

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [menuRef, setMenuRef] = useState(null);
    /* state for creating a ticket */
    const [openModal, setOpenModal] = useState(false);
    /* Stateful condition to ask a user if they want to delete ticket */
    const [confirmModal, setConfirmModal] = useState(false);
    /* when user submits/creates a new ticket, dipslay success message in snackbar */
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const navigateTo = useNavigate();

    /* Apply search fileters when searching for the tickets. */
    const [ticketFilters, setTicketFilters] = useState({
        ticketProgress:[],
        createdBy:'',
        ticketType:[],
        priority:[],
        assignedTo:''
    });



    const [loadingContent, setLoadingContent] = useState(true);
    const openMenuRef = Boolean(menuRef);
    const [collapseTable, setCollapseTable] = useState(false);
    
    const [ticketList, setTicketList] = useState([]);

    const [totalItems, setTotalItems] = useState(0);

    const [displayFilters, setDisplayFilters] = useState(false);

    const mounted = useRef(true);

    


    useEffect(()=> {
        //call api to get all the tickets.
        onFetchTickets({limit: limit, page:currentPage});
        return ()=> mounted.current = false;
    },[]);

    //set the current selected user 
    function onShowTableMenu(e, ticketId) {
        setMenuRef(e.currentTarget);
        setSelectedTicket(ticketId);
    }

    function onShowFilterMenu(){

    }

    function handleMenuAction(path) {
        navigateTo(path);
        onCloseMenu();
        return;
    }

    async function onFetchTickets(params) {
        try {
            setLoadingContent(true);
            mounted.current = true;
            const response = await Scout.get('/projects/myProjects/'+project._id+'/tickets',{params});
            if(mounted.current === false) return;
            setTicketList(response.data.data);
            setTotalItems(response.data.totalItems);
            console.log(response.data.totalItems)
        } catch(error) {
            console.log(error);
        } finally{
            setLoadingContent(false);
        }
    }

    function onCloseMenu() {
        setMenuRef(null);
        setSelectedTicket(null);
    }


    async function togglePage(val) {
        if(currentPage + val === 0 ||(currentPage-1)*limit >= totalItems) return;

        setCurrentPage(currentPage+val);
        await onFetchTickets({page: currentPage+val, limit});

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

    console.log(project.members);

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
                <MenuItem key='1' onClick={()=>onCloseMenu()}>
                    Re-open ticket
                </MenuItem>
                <MenuItem key='2' onClick={()=> handleMenuAction(`/projects/${project._id}/tickets/${selectedTicket}`)}>
                    View Ticket
                </MenuItem>
            </Menu>
            <div className="tickets-title">
                <div className="page-title">
                    <p className="text tickets-title">Tickets for {project.title}</p>
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
                        <IconButton onClick={()=> setDisplayFilters(!displayFilters)}  sx={{marginLeft:'10px'}}>
                            <FilterList/>
                        </IconButton>
                    </Tooltip>
                    <Typography marginLeft={'10px'}>Collapse View</Typography>
                    <Switch onChange={(e)=> setCollapseTable((collapsed)=> !collapsed)} color='success'/>
                    <Tooltip title='Refresh list'>
                        <IconButton onClick={()=> onFetchTickets({page: currentPage, limit})}>
                            <Autorenew/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Previous page'>
                        <IconButton 
                            disabled={currentPage === 1}
                            size='small' onClick={()=> togglePage(-1)}>
                            <ChevronLeft/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Next page">
                        <IconButton 
                            disabled={currentPage*limit >= totalItems}
                            size='small' onClick={()=> togglePage(1)}>
                            <ChevronRight/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={`tickets-filter-dropdown ${displayFilters?'active-dropdown':''}`}>
                <div className="ticket-filter-dropdown-content">
                    <Paper sx={{position:'relative'}} elevation={0} >
                        <Tooltip title={"Close Filters"} sx={{position:'absolute', top:'10px', right:'10px'}}>
                            <IconButton onClick={()=> setDisplayFilters(false)}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                        <Typography variant='h5'>Apply filters</Typography>
                        <Stack flexWrap={'wrap'} padding={'20px'} gap={5} direction={'row'}>
                            <Stack  direction='column'>
                                <FormControl>
                                    <FormLabel>Ticket Progress</FormLabel>
                                    <FormControlLabel control={<Checkbox defaultChecked value={"open"} />} label="Open" />
                                    <FormControlLabel control={<Checkbox value={"in_progress"} />} label="Closed" />
                                    <FormControlLabel control={<Checkbox value={"closed"} />} label="In Progress" />
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'}>
                                <FormControl>
                                    <FormLabel sx={{marginBottom: '15px'}}>Created By</FormLabel>
                                    <Autocomplete
                                        size='small'
                                        id="combo-box-demo"
                                        options={project.members}
                                        getOptionLabel={(option)=> option.firstName + " " + option.lastName}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Choose user" />}
                                    />
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'}>
                                <FormControl>
                                    <FormLabel>Ticket Type</FormLabel>
                                    <FormControlLabel control={<Checkbox defaultChecked value={"bug"} />} label="Bug" />
                                    <FormControlLabel control={<Checkbox value={"crash"} />} label="Crash" />
                                    <FormControlLabel control={<Checkbox value={"change"} />} label="Change" />
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'}>
                                <FormControl>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControlLabel control={<Checkbox defaultChecked value={"low"} />} label="Low" />
                                    <FormControlLabel control={<Checkbox value={"medium"} />} label="Medium" />
                                    <FormControlLabel control={<Checkbox value={"high"} />} label="High" />
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'}>
                                <FormControl>
                                    <FormLabel sx={{marginBottom: '15px'}}>Assigned To</FormLabel>
                                    <Autocomplete
                                        size='small'
                                        id="combo-box-demo"
                                        options={project.members}
                                        getOptionLabel={(option)=> option.firstName + " " + option.lastName}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Choose user" />}
                                    />
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Sort By</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="latest"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Recent" />
                                        <FormControlLabel value="male" control={<Radio />} label="Oldest" />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Paper>
                </div>
            </div>
            {
                !loadingContent && ticketList.length !== 0 && (
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
                        {
                            ticketList.map((ticket)=>{
                                return (
                                    <TableRow key={ticket._id}>
                                        <TableCell>
                                            <Typography>{ticket.summary}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{ticket.assignedTo.firstName + " " +ticket.assignedTo.lastName}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={ticket.progress} color='default'/>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={'high'} color={getPriorityColor(ticket.priority)}/>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction='row' alignItems={'center'}>
                                                <Tooltip title='options'>
                                                    <IconButton onClick={(e)=>onShowTableMenu(e,ticket._id)}>
                                                        <MoreVert/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
                )
            }
            {
                loadingContent === true && (
                    <Paper sx={paperSX} elevation={0}>
                        <CircularProgress
                        />
                        <Typography>Loading tickets</Typography>
                    </Paper>
                )
            }
            {
                loadingContent === false && ticketList.length === 0 && (
                    <Paper sx={paperSX} elevation={0}>
                        <MoodBad sx={{fontSize: '4rem', color:'gray', marginBottom:'10px'}}/>
                        <Typography>Looks like there are no tickets!</Typography>
                    </Paper>
                )
            }
        </div>
    )
}