import HorizontalNavigation from "../../components/HorizontalNavigation"
import VerticalNavigation from './components/VerticalNavigation';
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
} from "@mui/material";

import { memberRows, activityRows } from "./dev/dummy_data";

import DashboardPanel from "./components/DashboardPanel";

import "./styles/ProjectDashboard.css";
import ProjectMembersTable from "./components/ProjectMembersTable";
import RecentTicketsTable from "./components/RecentTicketsTable";

export default function ProjectDashboard() {

    function onHandleUpdateRole() {

    }


    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            <div className="pd-main">
                <div className="pd-section">
                    <Typography textAlign='Center' variant="h3">Project Dashboard (Search Engine)</Typography>
                </div>
                <div className="pd-section">
                    <div className="pd-panels">
                        <DashboardPanel
                            title={'My Tickets'}
                            content={'23'}
                            overlayContent={'View assigned tickets'}
                            color='rbg(0,128,255)'
                        />
                        <DashboardPanel
                            title={'Open Tickets'}
                            content={'14'}
                            overlayContent={'View open tickets'}
                            color={'#e7cb01'}
                        />
                        <DashboardPanel
                            title={'Production Errors'}
                            content={12}
                            overlayContent={'View production errors'}
                            color={'View production errors'}
                        />
                    </div>
                </div>
                <div className="pd-section">
                    <div className="pd-flex-layout">
                        
                        <div className="pd-table-container">
                            <div className="pd-table-label">
                                <Typography variant="h5">Project Members</Typography>
                            </div>
                            <ProjectMembersTable/>
                        </div>
                        <div className="pd-table-container">
                            <div className="pd-table-label">
                                <Typography variant="h5">Recent Tickets</Typography>
                            </div>
                            <RecentTicketsTable/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}