
import { 
    Alert, 
    Chip, 
    CircularProgress, 
    Paper, 
    Snackbar, 
    Typography, 
    Stack, 
    Button, 
    useMediaQuery ,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import "./styles/ProjectHome.css";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Modal from "@mui/material/Modal";
import ProjectModalContent from "./components/ProjectModalContent";
import { useNavigate } from "react-router-dom";
import Scout from "../../axios/scout";
import { Check, Close, DataObjectSharp, Groups } from "@mui/icons-material";
import Paginator from "./components/Paginator";
//make a request to get a list of projects for a user.

function TableStatus({children, height='475px'}) {
    return (
        <Paper
            elevation={3}
            sx={{
                height,
                width:'90vw',
                maxWidth:'1300px',
                margin:'0 auto'
            }}
        >
            <Stack
                gap={2}
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{height:'100%'}}
            >
                {children}
            </Stack>
        </Paper>
    )
}


export default function ProjectHome() {


    const inviteBreakPoint = useMediaQuery('(max-width: 880px)')

    //dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedInvite, setSelectedInvite] = useState({});



    console.log(inviteBreakPoint);

    //page
    const [currentPage, setCurrentPage] = useState(1);

    //limit
    const [resultsPerPage, setResultsPerPage] = useState(5);
    const [openProjectModal, setOpenProjectModal] = useState(false);
    const [totalProjects, setTotalProjects] = useState(0);

    const [loadingProjects, setLoadingProjects] = useState(false);

    //managing invites
    const [inviteList, setInviteList] = useState([]);
    const [totalInvites, setTotalInvites] = useState(0);
    const [loadingInvites, setLoadingInvites] = useState(false);
    const [invitesPerPage, setInvitesPerPage] = useState(5);
    const [invitePage, setInvitePage] = useState(1);
    /* for error display */
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [projectList, setProjectList] = useState([]);
    const navigate = useNavigate();

    const mounted = useRef(true);

    function onCloseModal() {
        
        setOpenProjectModal(false);
    }


    useEffect(()=> {
        fetchProjects();
        fetchInvites();
        return ()=> mounted.current = false;
    },[]);


    /**
     * @description - update the project list
     * @param {{page:number, limit:number}} params 
     */
    async function onUpdateProjectList(params) {
        try {
            console.log('outgoing request: ',params);
            const response = await Scout.get('/projects/myProjects',{params});
            setProjectList(response.data.data);
        } 
        catch(error) {
            setOpenSnackbar(true);
            console.log('error',error.message);
        }
    }


    /**
     * @description - Whenever user changes the results per page, just reset the page back to 1 and the 
     * adjusted limit to what is specified.
     * @param {string} e - value passed in from select tag
     */
    async function handleResultsPerPage(e) {
        setResultsPerPage(Number(e.target.value));
        setCurrentPage(1);
        await onUpdateProjectList({limit: Number(e.target.value), page: 1});
    }

    //do not allow user to go backward
    async function handlePaginatedResults(pageChange) {
        setCurrentPage((currentPage)=> currentPage+pageChange);
        await onUpdateProjectList({limit: resultsPerPage , page: currentPage+pageChange});

    }

    function onViewProject(projectId){
        navigate('/projects/'+projectId);
    }


    /* Async request to fetch all projects for a user. */
    async function fetchProjects() {
        try {
            setLoadingProjects(true);
            const response = await Scout.get('/projects/myProjects',{params:{page: currentPage, limit: resultsPerPage}});
            console.log(response.data)
            if(mounted){
                setProjectList(response.data.data);
                setTotalProjects(response.data.totalItems);
            }

        } catch(error){

        } finally {
            setLoadingProjects(false);
        }
    }

    /* Async request to find all invites for a user. */
    async function fetchInvites(params={}) {
        try {
            setLoadingInvites(true);
            const inviteResponse = await Scout.get('/invite',{params});
            setInviteList(inviteResponse.data.data);
            setTotalInvites(inviteResponse.data.totalItems);            
        } catch(error) {
            console.log(error, error.message);
        } finally {
            setLoadingInvites(false);
        }
    }


    /* Accept an invite and update list of current pending invites */
    async function onAcceptInvite(invite) {
        try {
            setLoadingInvites(true);
            const response = await Scout.post('/invite/acceptInvite',{invitation:invite._id});
            setInviteList(response.data.data);
            setTotalInvites(response.data.totalItems);
            setInvitesPerPage(5);
            setInvitePage(1);
            await fetchProjects();
        } catch(error) {
            console.log(error);
        } finally{
            setLoadingInvites(false);
        }
    }


    /* Reject an invite and update list of pending invites. */
    async function onRejectInvite() {
        try {
            const response = await Scout.post('/invite/rejectInvite',{invitation: selectedInvite._id})
            setInviteList(response.data.data);
            setTotalInvites(response.data.totalItems);
            setInvitePage(1);
            setInvitesPerPage(5);
            await fetchProjects();
        } catch(error) {
            console.log(error);
        } finally {
            onCloseDialog();
            setLoadingInvites(false);
        }
    }


    function onCloseDialog() {
        setOpenDialog(false);
    }
    
    function onOpenDialog(invite) {
        setOpenDialog(true);
        setSelectedInvite(invite);
    }


    async function handleInvitePagination(val) {
        const params = {
            limit: invitesPerPage,
            page: invitePage + val
        };
        console.log(params);
        setInvitePage((currentValue)=> currentValue + val);
        await fetchInvites(params);
    }

    async function handleInviteResultsPerPage(e) {
        setInvitesPerPage(Number(e.target.value));
        await fetchInvites({limit: Number(e.target.value), page: 1});
    }

    return (
        <div className="projectHome">
            <HorizontalNavigation/>
            <Modal
                open={openProjectModal}
                onClose={onCloseModal}
                sx={{paddingTop:'5vh'}}
            >
                <>
                    <ProjectModalContent
                        onCloseModal={onCloseModal}
                    />
                </>
            </Modal> 
            <Dialog
                open={openDialog}
                onClose={onCloseDialog}
            >
                <DialogTitle>Reject Invite from  <span style={{fontWeight:'bold'}}>{selectedInvite?.project?.title}</span>?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">You will not be able to join this group again until you receive another invitation.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onCloseDialog}
                        color="error"
                        sx={{textTransform:'none'}}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{textTransform:'none'}}
                        onClick={onRejectInvite}
                    >
                        Delete Invite
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                onClose={()=> setOpenSnackbar(false)}
                autoHideDuration={2000}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Alert severity="error">Unable to get projects. Check your connection.</Alert>
            </Snackbar>
            <div className="section">
                <div className="project-navigation">
                    <div className="project-nav">
                        <p className="project-welcome text">Project List</p>
                        <p className="text project md">All your projects in one place</p>
                    </div>
                    <div className="project-nav">
                        <div className="input-wrapper">
                            <input placeholder="Search any project..." type="text" className="search-project"/>
                            <i className="project-search-icon fas fa-search"></i>
                        </div>
                        <button
                            onClick={()=> setOpenProjectModal(true)}
                        >Create New Project <i className="add-icon fas fa-plus"></i></button>
                    </div>
                </div>
                {
                    (()=> {
                        if(loadingProjects === true) {
                            return (
                                <TableStatus>
                                        <CircularProgress/>
                                        <Typography fontSize={'1.3rem'} variant="body2">Loading Project Info...</Typography>
                                </TableStatus>
                            )
                        }

                        else if(totalProjects === 0) {
                            return (
                                <TableStatus>
                                    <DataObjectSharp sx={{fontSize:'4rem', color:'gray'}}/>
                                    <Typography fontSize={'2rem'} color={'gray'} variant="body2">No project data available.</Typography>
                                    <Typography variant="body2" color={'gray'} fontSize={'1.3rem'}>Look for invites or create a new project by clicking the button below.</Typography>
                                    <Button variant='outlined' onClick={(()=> setOpenProjectModal(true))}>Create New Project</Button>
                                </TableStatus>
                            )
                        }
                        return (
                            <div className="project-content-wrapper">
                                <div className="projects-container">
                                    {
                                        projectList.length !== 0 && (
                                            <table cellSpacing={0} className="project-table">
                                                <thead className="project-table-header">
                                                    <tr className="pt-row-header">
                                                        <th className="pt-item">Project Name</th>
                                                        <th className="pt-item">Member Count</th>
                                                        <th className="pt-item">Open Tickets</th>
                                                        <th className="pt-item">Bug Reports</th>
                                                        <th className="pt-item">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="project-table-body">
                                                    {
                                                        projectList.map(row => {
                                                            return (
                                                                <tr
                                                                    key={row._id}
                                                                    className="pt-row"
                                                                >
                                                                    <td className="pt-item">{row.title}</td>
                                                                    <td className="pt-item">
                                                                        <Chip color="info" label={row.members.length}/>
                                                                    </td>
                                                                    <td className="pt-item">
                                                                        <Chip color='warning' label={row.openTickets}/>
                                                                    </td>
                                                                    <td className="pt-item">
                                                                        <Chip color='error' label={row.bugReports}/>
                                                                    </td>
                                                                    <td className="pt-item">
                                                                        <Tooltip title='Options'>
                                                                            <IconButton>
                                                                                <MoreVertIcon/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title='View Project'>
                                                                            <IconButton
                                                                                onClick={()=> onViewProject(row._id)}
                                                                            >
                                                                                <DoubleArrowIcon/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )
                                    }
                                    {
                                        projectList.length === 0 && (
                                            <Paper elevation={0} sx={{height:'50vh'}}>
                                            </Paper>
                                        )
                                    }
                                </div>
                                {/* <div className="pt-pagination">
                                    <div className="pagination-item">
                                        <label htmlFor="_page-selector">Number of items</label>
                                        <select 
                                            onChange={handleResultsPerPage} 
                                            name="pt-selector" 
                                            id="_page-selector"
                                            className="pagination-select"
                                            value={resultsPerPage}
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                    <div className="pagination-item">
                                        <p className="text">{(currentPage-1)*resultsPerPage +1} - {Math.min(currentPage*resultsPerPage, totalProjects)} of {totalProjects} </p>
                                        <div>
                                            <Tooltip title="Previous page">
                                                <IconButton 
                                                    onClick={()=> handlePaginatedResults(-1)} 
                                                    size='small'
                                                    sx={{ opacity:currentPage === 1 ? 0.5: 1}}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ArrowBackIosIcon htmlColor="white" fontSize="0.7em"/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Next Page'>
                                                <IconButton 
                                                    onClick={()=> handlePaginatedResults(1)} 
                                                    size="small"
                                                    disabled={totalProjects <= currentPage*resultsPerPage}
                                                    sx={{opacity: totalProjects <= currentPage*resultsPerPage? 0.5:1}}
                                                >
                                                    <ArrowForwardIosIcon htmlColor="white" fontSize="0.7em"/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div> */}
                                <Paginator
                                    handleResultsPerPage={handleResultsPerPage}
                                    totalItems={totalProjects}
                                    resultsPerPage={resultsPerPage}
                                    currentPage={currentPage}
                                    handlePaginatedResults={handlePaginatedResults}
                                />
                            </div>
                        )
                    })()
                }
            </div>
            <Paper
                sx={{
                    width:inviteBreakPoint ? '100%' : '90vw',
                    maxWidth: '1300px',
                    margin:'50px auto',
                    boxSizing:'border-box',
                }}
                elevation={3}
            >
                <div className="ph-intro">
                    <p className="text">Manage Invitations</p>
                </div>
                {
                    (()=> {

                        if(loadingInvites === true) {
                            return (
                                <TableStatus
                                    height="200px"
                                >
                                    <CircularProgress/>
                                    <Typography fontSize={'1.3rem'} variant="body2">Loading invites...</Typography>
                                </TableStatus>
                            )
                        }

                        if(totalInvites === 0) {
                            return (
                                <TableStatus
                                    height="200px"
                                >
                                    <Groups sx={{color:'gray', fontSize:'3rem'}}/>
                                    <Typography fontSize={'1.3rem'} variant="body2">No Pending Invites at this time</Typography>
                                </TableStatus>
                            )
                        }
                        return (
                            <div className="ph-invitations-container">
                                {
                                    inviteList.map((invite)=> {
                                        return (
                                            <div key={invite._id} className="ph-invite-item">
                                                <Stack
                                                    direction={'row'}
                                                    alignItems={'center'}
                                                    justifyContent={'space-between'}
                                                >
                                                    <Typography variant="body2" fontSize={'1.2rem'}>
                                                        <span style={{fontWeight:'bold'}}>{invite.project.title}</span> is inviting you to join their project.
                                                    </Typography>
                                                    <Stack 
                                                        alignItems={'center'} 
                                                        justifyContent={'center'} 
                                                        direction={'row'} gap={1}
                                                        sx={{marginRight:'50px'}}
                                                    >
                                                        <Tooltip title='Reject Invitation'>
                                                            <IconButton color="error" onClick={()=>onOpenDialog(invite)}>
                                                                <Close/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Accept Invitation'}>
                                                            <IconButton color='success' onClick={()=> onAcceptInvite(invite)}>
                                                                <Check/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        )
                                    })
                                }
                                <Paginator
                                    handleResultsPerPage={handleInviteResultsPerPage}
                                    totalItems={totalInvites}
                                    resultsPerPage={invitesPerPage}
                                    currentPage={invitePage}
                                    handlePaginatedResults={handleInvitePagination}
                                />
                            </div>
                        )
                    })()
                }
            </Paper>
        </div>
    )
}