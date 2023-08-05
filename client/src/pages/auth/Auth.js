import { Outlet } from "react-router-dom";
import "./styles/Shared.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearLoadingErrors } from "../../redux/slice/projectSlice";

export default function Auth() {

    const dispatch = useDispatch();

    

    useEffect(()=> {
        dispatch(clearLoadingErrors());
    },[]);

    return (
        <div className="auth-container">
            <Outlet/>
        </div>
    )
}