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
    Stack,
    CircularProgress,

} from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { MoreVert, DataObjectSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Scout from "../../../axios/scout";
import { useSelector } from "react-redux";


function TicketStatusScreen({children}) {
    return (
        <Paper
            elevation={2}
            sx={{
                height:'300px',

            }}
        >
            <Stack
                sx={{height:'100%'}}
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}

            >
               {children}
            </Stack>
        </Paper>
    )

}



export default function RecentTicketsTable({onSetCardContent}) {

    let mounted = useRef(true);

    const activityHeaders = ['Title','Created By', 'Status','Priority', 'Actions'];
    const avatarSX = {height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'};
    const navigate = useNavigate();


    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [selectedTicketId, setSelectedTicketId] = useState(null)

    const [totalTicketCount, setTotalTicketCount] = useState(0);
    const [ticketData, setTicketData] = useState([]);
    const [menuRef, setMenuRef] = useState(null);
    const openMenu = Boolean(menuRef);
    const {currentProject} = useSelector((store)=> store.project);


    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(()=> {
        if(currentProject === null) return;
        fetchTicketData({});

        return ()=> mounted.current = false;
    },[currentProject]);


    

    async function onHandlePageChange(e,newPage) {
        setCurrentPage(newPage+1);
        await fetchTicketData({limit, page: newPage+1});
    }


    async function onHandleRowChange(e) {
        setLimit( parseInt(e.target.value,10) );
        setCurrentPage(1);
        await fetchTicketData({limit: +e.target.value, page: 1});
    }

    function onViewTicket(){
        setMenuRef(null);
        navigate('/projects/'+currentProject._id+'/tickets/'+selectedTicketId);
    }

    function onOpenMenu(e, selectedTicket) {
        setMenuRef(e.currentTarget)
        setSelectedTicketId(selectedTicket);
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


    async function fetchTicketData(queryParams){
        const ticket_url = `projects/myProjects/${currentProject._id}/tickets`;
        mounted.current = true;
        try{
            setLoadingTickets(true);
            const response = await Scout.get(ticket_url, {params:queryParams});
            if(mounted.current === false) return;
            setTicketData(response.data.data);
            setTotalTicketCount(response.data.totalItems);
            
        } catch(error) {
            console.log(error, error.message);
        } finally{
            setLoadingTickets(false);
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
            {
                (()=> {

                    if(loadingTickets === true) {
                        return (
                            <TicketStatusScreen>
                                <CircularProgress/>
                                <Typography variant="body2">Loading tickets</Typography>
                            </TicketStatusScreen>
                        )
                    }
                    else if(totalTicketCount === 0){
                        return (
                            <TicketStatusScreen>
                                <DataObjectSharp  sx={{fontSize: '5rem', color:'gray'}}/>
                                <Typography fontSize={'1.3rem'} variant="body2">No Data Available</Typography>
                            </TicketStatusScreen>
                        )
                    }
                    else return (
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{margin:'0 auto'}}>
                                    <TableHead>
                                        <TableRow>
                                            {activityHeaders.map((activityHeader)=><TableCell key={activityHeader}>{activityHeader}</TableCell>)}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ticketData.map((ticket)=> {
                                            return (
                                                <TableRow
                                                    key={ticket._id}
                                                >
                                                    <TableCell>
                                                        {ticket.summary}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="avatar-wrapper">
                                                            <Avatar sx={avatarSX}>
                                                                {ticket.assignedTo[0]}
                                                            </Avatar>
                                                            {ticket.assignedTo.firstName + " " + ticket.assignedTo.lastName}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {ticket.progress}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={ticket.priority} color={getPriorityColor(ticket.priority)}/>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={(e)=>onOpenMenu(e,ticket._id)}>
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
                                count={totalTicketCount}
                                rowsPerPage={limit}
                                page={currentPage-1}
                                onPageChange={onHandlePageChange}
                                onRowsPerPageChange={onHandleRowChange}
                            />
                        </>
                    )
                })()
           
            }
        </>
    )
} 