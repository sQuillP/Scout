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
 } from '@mui/material';

import {
    FilterList,
    Pageview,
    MoreVert,
    Label
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'

import "../styles/Tickets.css";
import { useState } from 'react';
import CreateTicket from '../components/CreateTicket';

export default function Tickets() {

    const [menuRef, setMenuRef] = useState(null);
    const [openModal, setOpenModal] = useState(true);
    const navigation = useNavigate();
    const [ticketFilters, setTicketFilters] = useState({

    });
    const [loadingContent, setLoadingContent] = useState(false);
    const openMenuRef = Boolean(menuRef);
    const [collapseTable, setCollapseTable] = useState(false);
    function onShowTableMenu(e) {
        setMenuRef(e.currentTarget);
    }

    function handleMenuAction(action) {
        if(action ==='resolve'){
            navigation('/projects/asdf')
        }
        onCloseMenu();
        return;
    }

    function onCloseMenu() {
        setMenuRef(null);
    }

    function onCloseModal() {
        setOpenModal(false);
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
        <div className="tickets-main">
            <Modal
                open={openModal}
                onClose={onCloseModal}

            >
                <>
                    <CreateTicket/>
                </>
            </Modal>
            <Menu
                open={openMenuRef}
                anchorEl={menuRef}
                onClose={onCloseMenu}
            >
                <MenuItem onClick={()=> handleMenuAction('resolve')}>
                    Re-open ticket
                </MenuItem>
                <MenuItem onClick={()=> handleMenuAction('view')}>
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
                                            <IconButton onClick={onShowTableMenu}>
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