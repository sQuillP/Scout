import { Link, useParams } from "react-router-dom";


import "../styles/VerticalNavigation.css"
import { Tooltip } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';


export default function VerticalNavigation() {

    const params = useParams();


    return (
        <div className="vertical-nav-container">
            <ul className="vertical-nav">
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Project Settings'>
                        <Link className="vert-nav-link" to={'/projects/'+params.projectId+'/settings'}>
                            <i className="menu-icon fa-solid fa-gear"></i>
                        </Link>
                    </Tooltip>
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Members'>
                        <Link className="vert-nav-link" to={'/projects/'+params.projectId+'/members'}>
                            <i className="menu-icon fa-solid fa-users"></i>
                        </Link>
                    </Tooltip>
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Tickets'>
                        <Link className="vert-nav-link" to={"/projects/"+params.projectId+"/tickets"}>
                            <i className="menu-icon fa-solid fa-ticket"></i>
                        </Link>
                    </Tooltip>
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title="Dashboard">
                        <Link className="vert-nav-link" to={"/projects/"+params.projectId}>
                            <i className="menu-icon fa-solid fa-table-columns"></i>
                        </Link>
                    </Tooltip>
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title="Home">
                        <Link className="vert-nav-link" to={'/projects'}>
                            <i className="menu-icon fa-solid fa-house"></i>
                        </Link>
                    </Tooltip>
                </li>
            </ul>
        </div>
    );
}