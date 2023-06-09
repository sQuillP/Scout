import { Typography } from "@mui/material"

import "../styles/DashboardPanel.css";

export default function DashboardPanel({title,content,overlayContent, color}) {

    return (
        <div style={{background:color}} className="pd-panel">
            <div className="pd-panel-title">
                <Typography variant="h4" textAlign='center'>{title}</Typography>
            </div>
            <div className="pd-panel-content">
                <div className="pd-circle">
                    <Typography align="center" variant="h4" textAlign='center'>{content}</Typography>
                </div>
            </div>
            <div className="pd-panel-overlay">
                    <Typography variant='h5' textAlign={'center'}>{overlayContent}</Typography>
            </div>
        </div>
    )
}