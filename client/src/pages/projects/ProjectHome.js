
import { Alert, Chip, Paper, Snackbar } from "@mui/material";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import "./styles/ProjectHome.css";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Modal from "@mui/material/Modal";
import ProjectModalContent from "./components/ProjectModalContent";
import { useNavigate } from "react-router-dom";
import Scout from "../../axios/scout";
//make a request to get a list of projects for a user.
const dummy_data = [
    {
        name: 'Enterprise Search Application',
        members: 34,
        openTickets:5,
        unresolvedBugs: 2,
        _id:'abc123'
    },
    {
        name:'Garage Sale Application',
        members: 34,
        openTickets:5,
        unresolvedBugs: 2,
        _id:'defghi',
    },
    {
        name:'Sales Application',
        members: 34,
        openTickets:5,
        unresolvedBugs: 2,
        _id:'jklmnosss'
    },
    {
        name:'Sales Application',
        members: 34,
        openTickets:5,
        unresolvedBugs: 2,
        _id:'jklmnoss'
    },
    {
        name:'Sales Application',
        members: 34,
        openTickets:5,
        unresolvedBugs: 2,
        _id:'jklmnos'
    },


]


export default function ProjectHome() {


    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(5);
    const [openProjectModal, setOpenProjectModal] = useState(false);

    /* for error display */
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [projectList, setProjectList] = useState([]);
    const navigate = useNavigate();

    function onCloseModal() {
        
        setOpenProjectModal(false);
    }

    useEffect(()=> {
        let mounted = true;
        ( async()=> {
            try{
                const response = await Scout.get('/projects/myProjects');
                console.log(response.data.data)
                if(mounted)
                    setProjectList(response.data.data);
            } catch(error) {
                console.log('error');
                setOpenSnackbar(true);//display error to user
            }
        })();

        return ()=> mounted = false;
    },[]);


    function onViewProject(){
        navigate('/projects/asdf');
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

            {/* section */}
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
                                                        <td className="pt-item">{row.name}</td>
                                                        <td className="pt-item">
                                                            <Chip color="info" label={row.members}/>
                                                        </td>
                                                        <td className="pt-item">
                                                            <Chip color='warning' label={row.openTickets}/>
                                                        </td>
                                                        <td className="pt-item">
                                                            <Chip color='error' label={row.unresolvedBugs}/>
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
                                            })}
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
                            <select name="pt-selector" id="_page-selector">
                                <option value="10">10</option>
                                <option value="10">20</option>
                                <option value="10">30</option>
                                <option value="10">40</option>
                            </select>
                        </div>
                        <div className="pagination-item">
                            <p className="text">1 - 10 of 100 </p>
                            <div>
                                <IconButton size='small'>
                                    <ArrowBackIosIcon htmlColor="white" fontSize="0.7em"/>
                                </IconButton>
                                <IconButton size="small">
                                    <ArrowForwardIosIcon htmlColor="white" fontSize="0.7em"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
