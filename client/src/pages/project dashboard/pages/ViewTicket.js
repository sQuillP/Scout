import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, forwardRef } from "react";
import useDebounce from "../../../hooks/useDebounce";
import NoComments from "../components/NoComments";
import _ from 'lodash';
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
    Switch,
    Dialog,
    CircularProgress,
    Slide,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,

} from '@mui/material';

import {
    ErrorOutline,
    BugReport,
    Construction,
    ChangeCircle,
    Search,
    AddComment,
    FilterAltSharp,
    Publish
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



const dummy_group_members = [
    {
        email:'will.m.pattison@gmail.com',
        username:'williampattison',
        _id:1
    },
    {
        email:'dan@gmail.com',
        username:'dantheman',
        _id:2
    },
    {
        email:'kristine@yahoo.com',
        username:'kristineisbest123',
        _id: 3
    },
    {
        email:'danielle@hotmail.com',
        username:'daniellehello2023',
        _id:5
    }
];


/**
 * 
 * TODO: add editable fields , make a submit button that glitters/glows,
 *  and have that be the submit button. If the form has not changed, do not allow changes
 * to be made.
 */


export default function ViewTicket() {

    //number of comments to be paginated.
    const comments_pagination = 5;
    const { ticketId } = useParams();
    const [ticketInfo, setTicketInfo] = useState({
        ticketType:'bug',
        briefDescription:'Sit fugiat aliquip est quis consectetur laboris sint excepteur do laboris aute enim. Laborum ullamco reprehenderit occaecat laborum reprehenderit eu irure est velit culpa. Laborum in dolor nostrud fugiat anim cupidatat consectetur laboris ex cillum anim minim. Ex elit officia est culpa excepteur irure. Elit est nostrud nostrud adipisicing Lorem officia nisi aliquip ipsum velit.',
        summary:'React application keeps crashing for no reason at all',
        priority:'high',
        assignTo: dummy_group_members[0].email,
        status:'in progress',
        createdOn:'02/26/1999',
        lastUpdated: '03/14/1999'
    });

    /* STATE FOR HANDLING COMMENTS */

    //set state for ticket comments
    const [ticketComments, setTicketComments] = useState([1,2,3,4,5]);

    /* State for handling comments */
    const [searchComment, setSearchComment] = useState('');
    const debouncedCommentSearch = useDebounce(searchComment,1000);
    const [commentFilters, setCommentFilters] = useState({});
    const [commentMenuRef, setCommentMenuRef] = useState(null);
    const showCommentMenu = Boolean(commentMenuRef);
    const [createCommentMode, setCreateCommentMode] = useState(false);

    /* Create async request to server adding a new comment to the list.
    * make a new request to the server with the updated comments list to show
    * the most recent changes. 
    */
    function onCreateNewComment(newComment) {
        console.log('Creating comment',newComment);
        onOpenSnackbar("Comment successfully created!", "success");
    }

    function handleCommentFilterChange(e) {
        // setCommentFilters(e.target.value);
    }

    function onOpenCommentMenu(e) {
        setCommentMenuRef(e.currentTarget);
    }

    function onCloseCommentMenu(){
        setCommentMenuRef(null);
    }

    /**********END COMMENT STATE *******************/



    /**********STATE FOR SNACKBAR ************/
    /* Conditionally show snackbar */
    const [openSnackbar, setOpenSnackbar] = useState(false);
    /* State for holding the snackbar message to be displayed to the user. */
    const [snackbarMessage, setSnackbarMessage] = useState('');
    /*Change the color of the snackbar for either an error message or success*/
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    function onCloseSnackbar() {
        setOpenSnackbar(false);
    }

    /*****END STATE FOR SNACKBAR ************/

    /* IN EDIT MODE */
    /* For edit mode in ticket */
    const [canEdit, setCanEdit] = useState(false);
    /* Condition to display the button to publish changes. */
    const [displayPublishChangesButton, setDisplayPublishChangesButton] = useState(false);
    /* show pending state when ticket update is sent. */
    const [pendingPublishChanges, setPendingPublishChanges] = useState(false);
    //store deep copy of original ticket.
    const [ticketInfoCopy, setTicketInfoCopy] = useState(_.cloneDeep(ticketInfo));
    /* Modal that is displayed before updates are applied to ticket. */
    const [showConfirmTicketChangesModal, setShowConfirmTicketChangesModal] = useState(false);
    /* Hold the ticket comments that user adds before submitting the changes. */
    const [ticketChangeComments, setTicketChangeComments] = useState('');

    function onDisplayConfirmTicketModal() {
        setShowConfirmTicketChangesModal(true);
        setPendingPublishChanges(false);
    }

    /* self explanatory, wrapper function. */
    function handleTicketChangeComments(event) {
        setTicketChangeComments(event.target.value);
    }

    function onHandleEditSwitchToggle() {
        if(canEdit){
            setTicketInfoCopy(_.cloneDeep(ticketInfo));
            setDisplayPublishChangesButton(false);
        }
        setCanEdit((canEdit)=> !canEdit);
    }
    /***************** */
    /* Revert all ticket changes and disable edit mode and its state features. */
    function onDiscardTicketChanges(){
        setShowConfirmTicketChangesModal(false);
        setPendingPublishChanges(false);
        setCanEdit(false);
        setTicketInfoCopy(_.cloneDeep(ticketInfo));
        setDisplayPublishChangesButton(false);
        setTicketChangeComments('');
        onOpenSnackbar("Ticket modifications have been discarded","error");
        
    }

    /* Whenever makes modification to a field,
    display a button on screen to allow modifications. */
    function updateTicketCopy(newValue, field) {
        const modifiedTicketInfoCopy = {...ticketInfoCopy,[field]:newValue};
        /* Deep comparison of objects */
        const madeTicketModifications = !_.isEqual(ticketInfo, modifiedTicketInfoCopy);

        console.log('newvalue,modified,real',newValue,modifiedTicketInfoCopy, ticketInfoCopy);
        /* if modifications have been made, allow users to publish changes. */
        if(madeTicketModifications)
            setDisplayPublishChangesButton(true);
        else
            setDisplayPublishChangesButton(false);
        setTicketInfoCopy(modifiedTicketInfoCopy);
    }


    /* Perform update on entire ticket. */
    function onSubmitEditChanges() {
        setPendingPublishChanges(true);

        console.log('setting loading')

        //simulate the changes being made.
        const timeout = setTimeout(()=> {
            setShowConfirmTicketChangesModal(false);
            setTicketInfo(_.cloneDeep(ticketInfoCopy));
            setDisplayPublishChangesButton(false);
            setCanEdit(false);
            setTicketChangeComments('');
            onOpenSnackbar("Successfully updated ticket.","success");
        },2000);
        //just update the ticket manually, make the change later from the db.
        //submit the new ticket,
        //fetch the newly updated ticket and store it in the original ticket.
        //append the change to the ticket history (this can be handled by the backend.)
    }


    /**
     * @param {string} message - opens snackbar with specified message as the body
     * @param {string} severity - should only be success or error. 
     * This will determine whether snackbar will show an error or success.
     */
    function onOpenSnackbar(message, severity) {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
        setSnackbarSeverity(severity);
    }


    /* **** */

    useEffect(()=> {
        //async request to get the ticket information using the ticketId params.
        //get the comments associated with the ticket, make sure to include pagination to the results.
    },[]);


    /**
     * @param {string} priority - can be either high | medium | low and maps those accordingly
     * @returns string - the mapped priority for the MUI Chip component
     */
    function getPriorityColor(priority) {
        switch(priority){
            case "high":
                return 'error';
            case "medium":
                return "warning";
            case "low":
                return "success";
            default:
                return "success"
        }
    }



    return (
        <div className="vt-container">
            {
                canEdit && displayPublishChangesButton && (
                <div className={`vt-submit-changes-container`}>
                
                    <button
                        className={`vt-submit-changes  ${ showConfirmTicketChangesModal?'vt-submit-disabled':''}`}
                        onClick={onDisplayConfirmTicketModal}
                        disabled={showConfirmTicketChangesModal}
                    >
                        Publish Changes
                        <Publish
                            style={{marginLeft:'10px'}}
                        />
                    </button>
                    {
                        showConfirmTicketChangesModal && (
                            <CircularProgress
                                color="success"
                                size={'1.5rem'}
                                sx={{
                                    position:'absolute',
                                    top:'-2px',
                                    left:'40%',
                                    margin:'10px 0 0 10px',
                                }}
                            />
                        )
                    }
                </div>
                )
            }
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3500}
                onClose={onCloseSnackbar}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Alert severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Menu
                anchorEl={commentMenuRef}
                open={showCommentMenu}
                onClose={onCloseCommentMenu}
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
            {/* Dialog for submitting ticket changes. */}
            <Dialog
                open={showConfirmTicketChangesModal}
                onClose={()=> null}
            >
               { !pendingPublishChanges &&(<DialogTitle>{'Please briefly describe your changes.'}</DialogTitle>)}
                <DialogContent>
                    {
                        (()=> {
                            if(pendingPublishChanges){
                                return (
                                    <Stack direction={'column'} alignItems={"center"} justifyContent={'center'}>
                                        <CircularProgress size={'2rem'}/>
                                        <DialogContentText textAlign={'center'}>Publishing changes...</DialogContentText>
                                    </Stack>
                                );
                            }
                            else {
                                return (
                                    <div style={{position:'relative'}}>
                                        <textarea
                                            value={ticketChangeComments}
                                            onChange={handleTicketChangeComments}
                                            className="vt-ticket-change-textarea"
                                            placeholder="Note: keep your description only 1 to 2 sentences."
                                            maxLength={100}
                                        >
                                        </textarea>
                                        <span 
                                            style={{
                                                color:'gray', 
                                                position:'absolute', 
                                                right:'0', 
                                                bottom:'-5px',
                                                fontSize:'0.7rem'
                                            }} 
                                            className="text"
                                        >
                                            {`${ticketChangeComments.length}/100 characters`}
                                        </span>
                                    </div>
                                );
                            }
                        })()
                    }
                </DialogContent>
                <DialogActions sx={{justifyContent:'center'}}>
                    {
                        (()=> {
                            //give user to cancel or apply ticket changes before submission.
                            if(!pendingPublishChanges){
                                return (
                                    <>
                                        <Button
                                            onClick={onDiscardTicketChanges}
                                            variant="contained"
                                            color="error"
                                            sx={{textTransform:'none'}}
                                        >Discard</Button>
                                        <Button
                                            onClick={onSubmitEditChanges}
                                            variant="contained"
                                            color="info"
                                            disabled={ticketChangeComments.length === 0}
                                            sx={{textTransform:'none'}}
                                        >Apply</Button>
                                    </>
                                );
                            }
                        })()
                    }
                </DialogActions>
            </Dialog>
            <div className="vt-header">
                <p className="text">
                    {ticketInfo.summary}
                </p>
                <FormControlLabel
                    label={`Allow editing: ${canEdit?"on":'off'}`}
                    control={
                        <Switch
                            onChange={onHandleEditSwitchToggle}
                            value={canEdit}
                            checked={canEdit}
                            disabled={false}//if user does not have permission, do not edit.
                        />
                    }
                />
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
                                        {
                                            canEdit?(
                                                <td className="vt-td-value">
                                                    <select 
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"assignTo")}
                                                        value={ticketInfoCopy.assignTo}
                                                        className="vt-edit-select"
                                                    >
                                                        {
                                                            dummy_group_members.map((member)=> {
                                                                return (
                                                                    <option 
                                                                        value={member.email} 
                                                                        key={member.email}
                                                                    >
                                                                        {member.email}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </td>

                                            ):(
                                                <td className="vt-td-value">{ticketInfo.assignTo}</td>
                                            )
                                        }
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Priority</th>
                                        <td className="vt-td-value">
                                            {
                                                canEdit?(
                                                    <select 
                                                        name="priority" 
                                                        id="_vt-priority"
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"priority")}
                                                        value={ticketInfoCopy.priority}
                                                        className="vt-edit-select"
                                                    >
                                                        <option value="high">High</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="low">Low</option>
                                                    </select>
                                                ):(
                                                    <Chip 
                                                        variant="outlined" 
                                                        color={getPriorityColor(ticketInfo.priority)}
                                                        label={ticketInfo.priority}
                                                        size="small"
                                                    />
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Ticket type</th>
                                        <td style={{display:'flex', alignItems:'center'}}  className="vt-td-value">
                                            {
                                                canEdit ?(
                                                    <select 
                                                        name="ticketType" 
                                                        id="_vt-ticket-type"
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"ticketType")}
                                                        value={ticketInfoCopy.ticketType}
                                                        className="vt-edit-select"
                                                    >
                                                        <option value="bug">Bug</option>
                                                        <option value="crash">Crash</option>
                                                        <option value="task">Task</option>
                                                        <option value="change">Change</option>
                                                    </select>
                                                ):(
                                                    <>
                                                        <IconSwitch
                                                            ticketType={ticketInfo.ticketType}
                                                        />
                                                        {ticketInfo.ticketType}
                                                    </>
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Ticket status:</th>
                                        <td className="vt-td-value">
                                            {
                                                canEdit? (
                                                    <select 
                                                        value={ticketInfoCopy.status}
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"status")}
                                                        className="vt-edit-select"
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="in progress">In progress</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                ):(
                                                    <Chip
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{color:'var(--dark-gold)', borderColor:'var(--dark-gold)'}}
                                                        label={ticketInfo.status}
                                                    />
                                                )
                                            }
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
                            {
                                canEdit?(
                                    <textarea 
                                        className="vt-edit-description"
                                        onChange={(e)=> updateTicketCopy(e.target.value,"briefDescription")}
                                        value={ticketInfoCopy.briefDescription}
                                    >
                                    </textarea>
                                ):(
                                    <p className="text vt-description">
                                        {ticketInfo.briefDescription}
                                    </p>   
                                )
                            }                 
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
