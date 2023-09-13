
import { Alert, Chip, CircularProgress, Paper, Snackbar, Typography, Stack, Button } from "@mui/material";
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
import { Check, Close, DataObjectSharp } from "@mui/icons-material";
//make a request to get a list of projects for a user.

function TableStatus({children}) {
    return (
        <Paper
            elevation={3}
            sx={{
                height:'475px',
                width:'90vw',
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




    /* for error display */
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [projectList, setProjectList] = useState([]);
    const navigate = useNavigate();

    const mounted = useRef(true);

    function onCloseModal() {
        
        setOpenProjectModal(false);
    }


    useEffect(()=> {
        ( async()=> {
            mounted.current = true;
            setLoadingProjects(true);
            try{
                const response = await Scout.get('/projects/myProjects',{params:{page: currentPage, limit: resultsPerPage}});
                console.log(response.data)
                if(mounted){
                    setProjectList(response.data.data);
                    setTotalProjects(response.data.totalItems);
                }

                //async request to get invites
            } catch(error) {
                console.log('error');
                setOpenSnackbar(true);//display error to user
            } finally{
                setLoadingProjects(false);
            }
        })();

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
                                <div className="pt-pagination">
                                    <div className="pagination-item">
                                        <label htmlFor="_page-selector">Number of items</label>
                                        <select 
                                            onChange={handleResultsPerPage} 
                                            name="pt-selector" 
                                            id="_page-selector"
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
                                </div>
                            </div>
                        )
                    })()
                }
            </div>
            <Paper
                sx={{
                    width:'90vw',
                    margin:'50px auto',
                    boxSizing:'border-box',
                    fontSize:'2.5rem'
                }}
                elevation={3}
            >
                <div className="ph-intro">
                    <p className="text">Manage Invitations</p>
                </div>
                {
                    (()=> {
                        return (
                            <div className="ph-invitations-container">
                                {
                                    [1,2,3,4].map((invite)=> {
                                        return (
                                            <div key={invite} className="ph-invite-item">
                                                <Stack
                                                    direction={'row'}
                                                    justifyContent={'space-between'}
                                                >
                                                    <Typography variant="body2" fontSize={'1.2rem'}>
                                                        Ezer Application join today!
                                                    </Typography>
                                                    <Stack 
                                                        alignItems={'center'} 
                                                        justifyContent={'center'} 
                                                        direction={'row'} gap={0}
                                                        sx={{marginRight:'50px'}}
                                                    >
                                                        <Tooltip title='Reject Invitation'>
                                                            <IconButton>
                                                                <Close/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Accept Invitation'}>
                                                            <IconButton>
                                                                <Check/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })()
                }
            </Paper>
        </div>
    )
}
