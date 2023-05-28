import { Outlet } from "react-router-dom";
import "./styles/Shared.css";

export default function Auth() {


    return (
        <div className="auth-container">
            <Outlet/>
        </div>
    )
}