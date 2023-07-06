import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce";
import NoComments from "../components/NoComments";
import {
    Chip, 
    IconButton, 
    Stack, 
    Tooltip,
    Snackbar,
    Typography,
    Alert,
    Menu,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Box,

} from '@mui/material';

import {
    ErrorOutline,
    BugReport,
    Construction,
    ChangeCircle,
    Search,
    AddComment,
    FilterAltSharp,
} from '@mui/icons-material';

import "../styles/ViewTicket.css";
import TicketComment from "../components/TicketComment";
import NewComment from "../components/NewComment";
import TicketHistoryTable from "../components/TicketHistoryTable";



/* Given the ticket type: bug, fix, crash, or build, the iconSwitch will return 
the appropriate icons. */
function IconSwitch({ticketType,}) {
    switch(ticketType){
        case "bug":
            return <BugReport/>;
        case "crash":
            return <ErrorOutline/>;
        case "task":
            return <Construction/>;
        case "change":
            return <ChangeCircle/>
        default: return null;
    }
}


export default function ViewTicket() {

    //number of comments to be paginated.
    const comments_pagination = 5;

    const { ticketId } = useParams();

    const [ticketInfo, setTicketInfo] = useState({
        ticketType:'bug',
        briefDescription:'This is the description Aliquip fugiat eu cupidatat pariatur. Do ullamco anim dolore id ut excepteur proident magna occaecat sint. Ea minim veniam nisi aliquip laboris ea exercitation nostrud aliqua sint nisi officia exercitation. Ad pariatur deserunt veniam ad id et ex amet incididunt aliquip laboris laborum qui adipisicing. Ipsum commodo sunt ut tempor est eiusmod aute irure eu proident quis ullamco aute.',
        summary:'React application keeps crashing for no reason at all',
        priority:'high',
        assignTo: {
            email:'will.m.pattison@gmail.com',
            username: 'william',
            id:1,
        },
        createdOn:'02/26/1999',
        lastUpdated: '03/14/1999'
    });

    //set state for ticket comments
    const [ticketComments, setTicketComments] = useState([1,2,3,4,5]);


    /* State for handling comments */
    const [searchComment, setSearchComment] = useState('');
    const debouncedCommentSearch = useDebounce(searchComment,1000);

    const [commentFilters, setCommentFilters] = useState({});

    function handleCommentFilterChange(e) {
        // setCommentFilters(e.target.value);
    }

    const [commentMenuRef, setCommentMenuRef] = useState(null);
    const showCommentMenu = Boolean(commentMenuRef);

    const [createCommentMode, setCreateCommentMode] = useState(false);

    function onOpenCommentMenu(e) {
        setCommentMenuRef(e.currentTarget);
    }

    function onCloseMenu(){
        setCommentMenuRef(null);
    }


    /* For handling snackbar state */
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    function onCloseSnackbar() {
        setOpenSnackbar(false);
    }

    /**
     * @param {string} message - opens snackbar with specified message as the body
     * @param {string} severity - should only be success or error. 
     * This will determine whether snackbar will show an error or success.
     */
    function onOpenSnackbar(message, severity) {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    }


    /* Create async request to server adding a new comment to the list.
    * make a new request to the server with the updated comments list to show
    * the most recent changes. 
    */
    function onCreateNewComment(newComment) {
        console.log('Creating comment',newComment);
        onOpenSnackbar("Comment successfully created!");
    }

    /* **** */

    //get pagination for the number of comments


    useEffect(()=> {
        //async request to get the ticket information using the ticketId params.

        //get the comments associated with the ticket, make sure to include pagination
        //to the results
    },[]);


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

    console.log(ticketId);


    return (
        <div className="vt-container">
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3500}
                onClose={onCloseSnackbar}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Alert severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Menu
                anchorEl={commentMenuRef}
                open={showCommentMenu}
                onClose={onCloseMenu}
            >
                <Box sx={{padding:'0 10px 10px 10px'}}>
                    <Typography fontSize={'0.9rem'}>Apply Search Filters</Typography>
                </Box>
                <MenuItem>
                    <FormControlLabel
                        label="label 1"
                        control={
                            <Checkbox
                                label='filter 1'
                                value="Filter 1"
                                onChange={()=>null}
                            />
                        }
                    />
                </MenuItem>
                <MenuItem>
                    <FormControlLabel
                        label="label 2"
                        control={
                            <Checkbox
                                value="Filter 2"
                                onChange={()=>null}
                            />
                        }
                    />
                </MenuItem>
                <MenuItem>
                <FormControlLabel
                    label='filter 3'
                    control={
                        <Checkbox
                            value="Filter 2"
                            onChange={()=>null}
                        />
                    }
                />
                </MenuItem>
            </Menu>
            <div className="vt-header">
                <p className="text">
                    {ticketInfo.summary}
                </p>
            </div>
            <div className="vt-flex-container">
                <div className="vt-flex-col">
                    <div className="vt-section">
                        <p className="text vt-section-label">Details</p>
                        <div className="vt-table-wrapper"
                            style={{
                                overflowX:'auto'
                            }}
                        >

                            <table 
                                style={{
                                    textAlign:'left', 
                                    padding: '10px', 
                                    overflowX:'auto',
                                }}
                                >
                                <tbody>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Assigned to</th>
                                        <td className="vt-td-value">{ticketInfo.assignTo.email}</td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Priority</th>
                                        <td className="vt-td-value">
                                            <Chip 
                                                variant="outlined" 
                                                color={getPriorityColor(ticketInfo.priority)}
                                                label={ticketInfo.priority}
                                                size="small"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Ticket type</th>
                                        <td style={{display:'flex', alignItems:'center'}}  className="vt-td-value">
                                            <IconSwitch
                                                ticketType={ticketInfo.ticketType}
                                            />
                                            {ticketInfo.ticketType}
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Created on</th>
                                        <td className="vt-td-value">
                                            <p className="text vt-smalltext">
                                                {ticketInfo.createdOn}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Last updated</th>
                                        <td className="vt-td-value">
                                            <p className="text vt-smalltext">
                                                {ticketInfo.lastUpdated}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Description</p>
                        <div className="vt-description-wrapper">
                            <p className="text vt-description">
                                {ticketInfo.briefDescription}
                            </p>
                        </div>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Ticket History</p>
                        <div className="vt-activity-wrapper">
                            <TicketHistoryTable
                                ticketId={ticketId}
                            />
                        </div>
                    </div>
                </div>
                <div className="vt-flex-col vt-comments">
                    <div className="vt-section">
                        <p className="text vt-section-label">Comments</p>
                        <div className="vt-comment-paginator">

                        </div>
                        <div className="vt-section-comments">
                            <div className="vt-comment-search">

                                <div className="input-wrapper">
                                    <input 
                                        onChange={(e)=> setSearchComment(e.target.value)} 
                                        type="text" 
                                        className="vt-search-comment" 
                                        value={searchComment}
                                        placeholder="Search Comments"
                                        disabled={createCommentMode}

                                    />
                                    <Tooltip
                                        title='search'
                                    >
                                        <IconButton 
                                            sx={{
                                                position:'absolute', 
                                                top:'3px', 
                                                right:'10px'
                                            }} 
                                            size="small"
                                        >
                                            <Search/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <Stack 
                                    direction={'row'} 
                                    alignItems={'center'} 
                                    justifyContent={'center'}
                                    marginLeft={'10px'}
                                >
                                    <Tooltip
                                        title='Filter Comments'
                                    >
                                        <IconButton 
                                            onClick={onOpenCommentMenu} 
                                            size="medium"
                                            disabled={createCommentMode}
                                        >
                                            <FilterAltSharp/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Add Comment">
                                        <IconButton 
                                            disabled={createCommentMode}
                                            onClick={()=> setCreateCommentMode(true)} size='medium'>
                                            <AddComment color="lightgray"/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </div>
                            {
                                createCommentMode && (
                                    <NewComment
                                        onCreateNewComment={onCreateNewComment}
                                        onDiscard={()=> setCreateCommentMode(false)}
                                    />
                                )
                            }
                            {// conditionally render comment section
                                ticketComments.length === 0 && createCommentMode === false ?( <NoComments/>):(
                                    ticketComments.map(comment=> {
                                        return <TicketComment key={comment}/>
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}