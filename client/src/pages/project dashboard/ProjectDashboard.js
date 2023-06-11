import HorizontalNavigation from "../../components/HorizontalNavigation"
import VerticalNavigation from './components/VerticalNavigation';
import { 
    Typography,


} from "@mui/material";

import "./styles/ProjectDashboard.css";

export default function ProjectDashboard() {


    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            <div className="pd-main">
                <div className="pd-section">
                    <Typography textAlign='left' variant="h4">Project Dashboard</Typography>
                </div>
                <div className="pd-section">
                    <div className="pd-panels">
                        <div style={{}} className="pd-panel">
                            <div className="pd-panel-title"></div>
                        </div>
                        <div className="pd-panel">
                            <div className="pd-panel-title">

                            </div>
                        </div>
                        <div className="pd-panel">
                            <div className="pd-panel-title">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}