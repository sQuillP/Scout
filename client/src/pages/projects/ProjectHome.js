
import { Chip } from "@mui/material";
import HorizontalNavigation from "./components/HorizontalNavigation"
import VerticalNavigation from "./components/VerticalNavigation"
import "./styles/ProjectHome.css";


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
        _id:'jklmno'
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

/**
 * show a total results on teh bottom right of hte table
 * possibly divide the page up into sections
 */
    return (
        <div className="projectHome">
            <HorizontalNavigation/>
            {/* <VerticalNavigation/> */}
            
            <div className="projects-container">
                <div className="project-welcome-wrapper">
                    <p className="text welcome-text">{getSalutations() + ", Will"}</p>
                </div>
                <div className="project-search">
                    <div className="project-search-header">
                        <p className="text">Search for a project</p>
                    </div>
                </div>
                <div className="projects-container-wrapper">
                    <div className="project-table-header">
                        <p className="text project-table-header-text">
                            My Project List
                        </p>
                    </div>
                    <table className="projects-table" cellSpacing={0}>
                        <tbody>
                            <tr className="projects-tr-header">
                                <th className="projects-th">Project Name</th>
                                <th className="projects-th">Members</th>
                                <th className="projects-th">Open Tickets</th>
                                <th className="projects-th">Unresolved Bugs</th>
                            </tr>
                            {
                                dummy_data.map((project)=> {
                                    return (
                                        <tr 
                                            key={project._id}
                                            border='0'
                                            className="projects-tr"
                                        >
                                            <td className="projects-td">
                                                {project.name}
                                            </td>
                                            <td className="projects-td">
                                                <Chip color="info" label={project.members}/>
                                            </td>
                                            <td className="projects-td">
                                                <Chip color="warning" label={ +project.openTickets }/>
                                            </td>
                                            <td className="projects-td">
                                                <Chip color='error' label={project.unresolvedBugs}/>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}