import { 
    Typography,
    Avatar,
    Stack
} from "@mui/material";


import DashboardPanel from "../components/DashboardPanel";

import "../styles/ProjectDashboard.css";
import ProjectMembersTable from "../components/ProjectMembersTable";
import RecentTicketsTable from "../components/RecentTicketsTable";

import {
    NewReleases,
} from '@mui/icons-material';
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ProjectDashboard() {

    const currentProject = useSelector((store)=> store.project.currentProject);
    const user = useSelector((store)=> store.auth.user);

    
    console.log(currentProject);


    function onHandleUpdateRole() {

    }


    return (
        <div className="pd-main">
            <div className="pd-section">
                <Typography textAlign='Center' variant="h3" padding={'20px'}>Project Dashboard (Search Engine)</Typography>
            </div>
            <div className="pd-section">
                <Stack 
                    direction={'row'} 
                    justifyContent={'center'}
                    flexWrap={'wrap'}
                    columnGap={10}
                    rowGap={3}
                >
                    <DashboardPanel
                        title={'Tickets currently assigned to me'}
                        content={currentProject?.assignedTickets || 0}
                        routeState={{assignedTo: user._id}}
                        PanelIcon={()=> <Avatar sx={{height: '50px', width:'50px'}}>A</Avatar>}
                    />
                    <DashboardPanel
                        title={'Open Tickets (currently not assigned)'}
                        content={currentProject?.openTickets || 0}
                        routeState={{progress: 'open'}}
                        PanelIcon={()=> <NewReleases sx={{fontSize: '3rem', color:'goldenrod'}}/>}
                    />
                    
                </Stack>
            </div>
            <div className="pd-section">
                <div className="pd-flex-layout">
                    
                    <div className="pd-table-container">
                        <div className="pd-table-label">
                            <Typography variant="h5">Project Members</Typography>
                        </div>
                        <ProjectMembersTable
                            showActions={false}
                            containerSX={{width:'100%'}}
                        />
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
    )
}