import { Link } from "react-router-dom";


import "../styles/VerticalNavigation.css"
import { Tooltip } from "@mui/material";


export default function VerticalNavigation() {



    return (
        <div className="vertical-nav-container">
            <ul className="vertical-nav">
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Analytics'>
                        <Link className="vert-nav-link">
                            <i className="menu-icon fa-solid fa-chart-simple"></i>
                        </Link>
                    </Tooltip>
                    {/* <span className="vert-nav-text">Analytics</span> */}
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Users'>
                        <Link className="vert-nav-link">
                            <i className="menu-icon fa-solid fa-users"></i>
                        </Link>
                    </Tooltip>
                    {/* <span className="vert-nav-text">Manage Users</span> */}
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Tickets'>
                        <Link className="vert-nav-link">
                            <i className="menu-icon fa-solid fa-ticket"></i>
                        </Link>
                    </Tooltip>
                    {/* <span className="vert-nav-text">Tickets</span> */}
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title='Project Settings'>
                        <Link className="vert-nav-link" to="">
                            <i className="menu-icon fa-solid fa-gear"></i>
                        </Link>
                    </Tooltip>
                    {/* <span className="vert-nav-text">Project Settings</span> */}
                </li>
                <li className="vert-nav-item">
                    <Tooltip placement="top" title="Home">
                        <Link className="vert-nav-link">
                            <i className="menu-icon fa-solid fa-house"></i>
                        </Link>
                    </Tooltip>
                    {/* <span className="vert-nav-text">Home</span> */}
                </li>
            </ul>
        </div>
    );
}