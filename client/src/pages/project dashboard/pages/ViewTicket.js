import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
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
    Autocomplete,
    TextField,
} from '@mui/material';
import {
    ErrorOutline,
    BugReport,
    Construction,
    ChangeCircle,
    Search,
    AddComment,
    FilterAltSharp,
    Publish,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';


import "../styles/ViewTicket.css";
import TicketComment from "../components/TicketComment";
import NewComment from "../components/NewComment";
import TicketHistoryTable from "../components/TicketHistoryTable";
import Scout from "../../../axios/scout";
import { useSelector, useDispatch } from "react-redux";
import SubmitChangesButton from "../../../components/SubmitChangesButton";
import CommentFilters from "../components/CommentFilters";



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

    const mounted = useRef(true);
    const currentProject = useSelector((store)=> store.project.currentProject);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //number of comments to be paginated.
    const comments_pagination = 5;
    const { ticketId } = useParams();
    const [ticketInfo, setTicketInfo] = useState({
        assignedTo:'',
        createdAt:'',
        description:'',
        priority:'',
        progress:'',
        project:'',
        summary:'',
        ticketType:'',
        updatedAt:''
    });

    /* Request object that is made  */
    const [ticketInfoRequest, setTicketInfoRequest] = useState({});


    /* STATE FOR HANDLING COMMENTS */

    //set state for ticket comments
    const [ticketComments, setTicketComments] = useState([]);

    const [commentPage, setCommentPage] = useState(1);
    const [commentLimit, setCommentLimit] = useState(5);
    const [totalComments, setTotalComments] = useState(0);

    /* State for handling comments */
    const [searchComment, setSearchComment] = useState('');
    const debouncedCommentSearch = useDebounce(searchComment,1000);
    const [commentFilters, setCommentFilters] = useState({
        startDate: null,
        endDate: null, 
        user: null,
    });
    const [showCommentFilters, setShowCommentFilters] = useState(false);
    const [createCommentMode, setCreateCommentMode] = useState(false);

    /*
     Create async request to server adding a new comment to the list.
    * make a new request to the server with the updated comments list to show
    * the most recent changes. 
    */
    async function onCreateNewComment(newComment) {
        try{
            //make a post request to comments route
            const requestBody = {
                content:newComment
            };
            const commentResponse = await Scout.post(`/projects/myProjects/${currentProject._id}/tickets/${ticketId}/comments`,requestBody);
            //from the response, should return the first five comments in the database, set those comemnts
            setCommentPage(1);
            setTotalComments(commentResponse.data.itemCount);
            setTicketComments(commentResponse.data.data);
            onOpenSnackbar("Comment successfully created!", "success");
            //fetch latest instance of comments
        } catch(error){
            onOpenSnackbar("Unable to post comment", "error");
        }
    }

    function handleCommentFilterChange(e) {
        // setCommentFilters(e.target.value);
    }

    /* When user paginates through the comment list */
    async function onToggleCommentPage(increment) {
        try{

            const query = {
                page: commentPage+increment,
                limit: commentLimit,
                term: debouncedCommentSearch,
                filters: commentFilters,
            };

            await fetchComments(query);
            setCommentPage(commentPage+increment);
        } catch(error){
            console.log(error,error.message);
            onOpenSnackbar("Unable to retrieve comment list","error");
        }
    }

    function onOpenCommentMenu(e) {
        setShowCommentFilters(true);
    }

    function onCloseCommentMenu(){
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

    /* Ticket history state */

    const [refreshHistoryData, setRefreshHistoryData] = useState({});

    /* Revert all ticket changes and disable edit mode and its state features. */
    function onDiscardTicketChanges(){
        setShowConfirmTicketChangesModal(false);
        setPendingPublishChanges(false);
        setCanEdit(false);
        setTicketInfoCopy(_.cloneDeep(ticketInfo));
        setDisplayPublishChangesButton(false);
        setTicketChangeComments('');
        onOpenSnackbar("Ticket modifications have been discarded","error");
        setTicketInfoRequest({});
        
    }

    /* Whenever makes modification to a field,
    display a button on screen to allow modifications. */
    function updateTicketCopy(newValue, field) {
        const modifiedTicketInfoCopy = {...ticketInfoCopy,[field]:newValue};
        ticketInfoRequest[field] = newValue;
        /* Deep comparison of objects */
        const madeTicketModifications = !_.isEqual(ticketInfo, modifiedTicketInfoCopy);
        /* if modifications have been made, allow users to publish changes. */
        if(madeTicketModifications)
            setDisplayPublishChangesButton(true);
        else
            setDisplayPublishChangesButton(false);
        setTicketInfoCopy(modifiedTicketInfoCopy);
    }


    /* Perform update on entire ticket object */
    async function onSubmitEditChanges() {
        setPendingPublishChanges(true);

 
        try {
            setShowConfirmTicketChangesModal(false);
            setDisplayPublishChangesButton(false);
            setCanEdit(false);
            const ticketHistoryBody = {ticket:ticketId, description: ticketChangeComments};
            const resolvedData = await Promise.all([
                Scout.put(`/projects/myProjects/${currentProject._id}/tickets/${ticketId}`,ticketInfoRequest),
                Scout.post(`/projects/myProjects/${currentProject._id}/tickets/${ticketId}/ticketHistory`,ticketHistoryBody)
            ]);

            setTicketInfo(resolvedData[0].data.data);
            setTicketInfoCopy(_.cloneDeep(resolvedData[0].data.data));
            setRefreshHistoryData(resolvedData[1].data);
            onOpenSnackbar("Successfully updated ticket.","success");
        } catch(error) {
            onOpenSnackbar("Unable to update ticket","error");
        } finally {
            setPendingPublishChanges(false);
            setTicketChangeComments('');
        }
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

 
    /* Initial page load */
    useEffect(()=> {
        mounted.current = true;
        ( async()=> {
            try {
                
                const resolvedTicketInfo = await Scout.get('/projects/myProjects/'+currentProject._id+'/tickets/'+ticketId);
                await fetchComments({limit:5, page: 1,})
                if(Object.keys(resolvedTicketInfo.data.data).length === 0){
                    return navigate('/auth/login');
                }
                if(mounted.current === false) return;
                setTicketInfo(resolvedTicketInfo.data.data);
                setTicketInfoCopy(_.cloneDeep(resolvedTicketInfo.data.data));
            } catch(error) {
                console.error(error,error.message);
                navigate('/auth/login');
            }
        })();
        return ()=> mounted.current = false;
    },[]);


    useEffect(()=> {
        const params = {
            page: commentPage,
            limit: commentLimit,
            term: debouncedCommentSearch,
            filters: commentFilters
        };

        if(debouncedCommentSearch === ''){
            fetchComments(params);
            return;
        };
        ( async ()=> {
            try {
                await fetchComments(params);
                setCommentPage(1);
            } catch(error) {
                console.log('search comments error');
            }
        })();
    },[debouncedCommentSearch]);


    /* Get the data from comments and set the current data and item count */
    async function fetchComments(query){
        try{
            const commentResponse = await Scout.get(`/projects/myProjects/${currentProject._id}/tickets/${ticketId}/comments`,{params:query});
            if(mounted.current === false) return;
            setTicketComments(commentResponse.data.data);
            setTotalComments(commentResponse.data.itemCount);
        } catch(error){
            //error to load any comments
        }
    }


    /* Make sure editable project has latest instance of project */
    useEffect(()=> {
        setTicketInfoCopy(_.cloneDeep(currentProject));
    },[currentProject]);



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


    async function getFilterData(filters) {
        if(filters.user !== null){
            filters = {...filters, user: filters.user._id};
        }
        setCommentFilters(filters);
        setCommentPage(1);
        setCommentLimit(5);
        await fetchComments({page:1, limit: 5, filters, term: debouncedCommentSearch});
    }

    return (
        <div className="vt-container">
            <SubmitChangesButton
                onClick={onDisplayConfirmTicketModal}
                disabled={showConfirmTicketChangesModal}
                showProgress={showConfirmTicketChangesModal}
                showButton={canEdit && displayPublishChangesButton}
            />
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
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"assignedTo")}
                                                        value={ticketInfoCopy.assignedTo}
                                                        className="vt-edit-select"
                                                    >
                                                        {
                                                            currentProject.members.map((member)=> {
                                                                return (
                                                                    <option 
                                                                        value={member._id} 
                                                                        key={member._id}
                                                                    >
                                                                        {member.email}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </td>

                                            ):(
                                                <td className="vt-td-value">
                                                    {
                                                    currentProject.members.find((member)=>{
                                                    return member._id === ticketInfo.assignedTo
                                                })?.email
                                                }</td>
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
                                                        value={ticketInfoCopy.progress}
                                                        onChange={(e)=> updateTicketCopy(e.target.value,"progress")}
                                                        className="vt-edit-select"
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="in_progress">In progress</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                ):(
                                                    <Chip
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{color:'var(--dark-gold)', borderColor:'var(--dark-gold)'}}
                                                        label={ticketInfo.progress}
                                                    />
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Created on</th>
                                        <td className="vt-td-value">
                                            <p className="text vt-smalltext">
                                                {ticketInfo.createdAt}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr className="vt-tr">
                                        <th className="vt-th-label">Last updated</th>
                                        <td className="vt-td-value">
                                            <p className="text vt-smalltext">
                                                {ticketInfo.updatedAt}
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
                                        onChange={(e)=> updateTicketCopy(e.target.value,"description")}
                                        value={ticketInfoCopy.description}
                                    >
                                    </textarea>
                                ):(
                                    <p className="text vt-description">
                                        {ticketInfo.description}
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
                                refreshHistoryData={refreshHistoryData}
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
                                    gap={1}
                                >
                                    <Tooltip
                                        title='Filter Comments'
                                    >
                                        <IconButton 
                                            onClick={()=> setShowCommentFilters(!showCommentFilters)} 
                                            size="medium"
                                            disabled={createCommentMode}
                                        >
                                            <FilterAltSharp/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Add Comment">
                                        <IconButton 
                                            disabled={createCommentMode}
                                            onClick={()=> setCreateCommentMode(true)} size='medium'
                                        >
                                            <AddComment color="lightgray"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Previous page">
                                        <IconButton 
                                            size='small' 
                                            onClick={()=>onToggleCommentPage(-1)}
                                            disabled={commentPage === 1}
                                        >
                                            <ChevronLeft/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Next Page">
                                        <IconButton 
                                            size="small" 
                                            onClick={()=>onToggleCommentPage(1)}
                                            disabled={commentPage*commentLimit >= totalComments}
                                        >
                                            <ChevronRight/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </div>
                            <div className={`vt-filter-container ${showCommentFilters?'expanded':''}`}>
                                <div className="vt-filter-expandable">
                                    <div className="vt-filter-content">
                                            <CommentFilters
                                                getFilterData={getFilterData}
                                                onCollapse={()=> setShowCommentFilters(!showCommentFilters)}
                                                
                                                

                                            />
                                    </div>
                                </div>
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
                                        return (
                                            <TicketComment 
                                                comment={comment}
                                                key={comment._id}
                                            />
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}