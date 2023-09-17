import { Link } from "react-router-dom"
import { ButtonBase, Paper, IconButton, Stack, Tooltip } from "@mui/material"
import {Close} from '@mui/icons-material';
import "../styles/AlertItem.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



export default function AlertItem({data, onClose}) {


    const navigation = useNavigate();
    const project = useSelector((store)=> store.project.currentProject);

    //pass in the close function with the data id
    function onCloseAlert() {
        onClose(data._id);
    }

    function calculatePriorityColor(priority){
        switch(priority){
            case "ticket":
                return 'red';
            case "change":
                return "gold";
            case "comment":
                return "green";
        }
        return "green";
    }

    function handleNavigation(route) {
        navigation(route);
        onClose();
    }

    return (
        <div 
            onClick={()=> handleNavigation('/projects/'+project._id+'/tickets/'+data.ticket)} 
            className="alert-item-wrapper">
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    padding={'10px'}
                    gap={2}

                >
                    <div style={{background: calculatePriorityColor(data.notificationFor) }} className="priority-circle"></div>
                    <p className="text alert-title">{data.title}</p>
                    <Tooltip
                        title="Clear alert"
                    >
                        <IconButton 
                            sx={{
                                position:'absolute',
                                top:'10px',
                                right:'10px'
                            }}
                            size="small"

                            onClick={onCloseAlert}>
                            <Close/>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <div className="alert-content">
                    <p className="text alert-message">{data.description.substring(0,50) + "..."}</p>
                </div>
        </div>
    )
}