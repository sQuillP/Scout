import { Link } from "react-router-dom";


import "../styles/VerticalNavigation.css"


export default function VerticalNavigation() {



    return (
        <div className="vertical-nav-container">
            <div className="project-title-container">
                <p className="text project-title">Project Menu</p>
            </div>
            <ul className="vertical-nav">
                <li className="vert-nav-item">
                    <Link className="vert-nav-link">
                        <i className="menu-icon fa-solid fa-chart-simple"></i>
                        <span className="vert-nav-text">Analytics</span>
                    </Link>
                </li>
                <li className="vert-nav-item">
                    <Link className="vert-nav-link">
                        <i className="menu-icon fa-solid fa-users"></i>
                        <span className="vert-nav-text">Manage Users</span>
                    </Link>
                </li>
                <li className="vert-nav-item">
                    <Link className="vert-nav-link">
                        <i className="menu-icon fa-solid fa-ticket"></i>
                        <span className="vert-nav-text">Tickets</span>
                    </Link>
                </li>
                <li className="vert-nav-item">
                    <Link className="vert-nav-link" to="">
                        <i className="menu-icon fa-solid fa-gear"></i>
                        <span className="vert-nav-text">Project Settings</span>
                    </Link>
                </li>
                <li className="vert-nav-item">
                    <Link className="vert-nav-link">
                        <i className="menu-icon fa-solid fa-house"></i>
                        <span className="vert-nav-text">Home</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}