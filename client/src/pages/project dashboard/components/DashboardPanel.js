import { 
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Stack,
    useMediaQuery
 } from "@mui/material"

import {
    East,
    MoreHoriz,
    Reply,
} from '@mui/icons-material';

import { useNavigate } from "react-router-dom";

import "../styles/DashboardPanel.css";
import { useSelector } from "react-redux";



/**
 * 
 * @param {{
 *  title: string,
 *  content: string,
 *  PanelIcon: React.Node
 * }} 
 * 
 */
export default function DashboardPanel({title,content,PanelIcon, routeState}) {

    const navigate = useNavigate();
    const project = useSelector((store)=> store.project.currentProject);

    const minifiedScreen = useMediaQuery('(max-width:614px)');

    //navigate to tickets with predefined filters. based on dashboard panel
    function onNavigateTickets() {
        navigate(`/projects/${project._id}/tickets`, {state:{routeState}});
    }

    return (
        <Paper sx={{
                position:'relative', 
                padding: '20px 20px 20px 20px',
                width: minifiedScreen ? '90%' : '225px',
                borderRadius: '10px'
            }}  
            elevation={3}
        >
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
            >
                <PanelIcon/>
                <Tooltip
                    title='View Issues'
                >
                    <IconButton 
                        onClick={onNavigateTickets}
                        sx={{width: '40px', height:'40px'}}
                    >
                        <East
                        />
                    </IconButton>
                </Tooltip>
            </Stack>
            <p className="text dp-value">{content}</p>
            <p className="text dp-title">{title}</p>
        </Paper>
    )
}