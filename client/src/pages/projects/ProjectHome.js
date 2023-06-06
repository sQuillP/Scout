
import { Chip } from "@mui/material";
import HorizontalNavigation from "./components/HorizontalNavigation"
import "./styles/ProjectHome.css";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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


function getSalutations() {
    const currentDate = new Date();
    const time = currentDate.getHours();
    if(time <  12 && time >= 4)
        return "Good Morning";
    else if(time <= 17 && time >= 12)
        return "Good Afternoon";
    else
        return "Good Evening";
}

export default function ProjectHome() {


    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(5);

    return (
        <div className="projectHome">
            <HorizontalNavigation/>

            {/* section */}
            <div className="section">
                <div className="project-navigation">
                    <p className="project-welcome">Project List</p>
                    <div className="project-nav-right">
                        <input type="text" className="search-project"/>
                        <button>Create New Project</button>
                    </div>
                </div>
                <div className="project-content-wrapper">
                    <div className="projects-container">
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
                                {dummy_data.map(row => {
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
                                                    <IconButton>
                                                        <DoubleArrowIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
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

/**
 * 
 * 
 * <IconButton size="small">
                                                <ArrowForwardIosIcon fontSize="0.7em"/>
                                            </IconButton>
 */