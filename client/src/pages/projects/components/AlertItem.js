import { Link } from "react-router-dom"
import { ButtonBase, Paper } from "@mui/material"

import "../styles/AlertItem.css";

export default function AlertItem({data, onClose}) {

    //pass in the close function with the data id
    function onCloseAlert() {
        onClose(data.id);
    }

    function calculatePriorityColor(priority){
        console.log('calculating priority');
        switch(priority){
            case "high":
                return 'red';
            case "medium":
                return "gold";
            case "low":
                return "green";
        }
        return "green";
    }

    return (
        <div className="alert-item-wrapper">
            <ButtonBase className="alert-item-main" sx={{padding: '20px 30px 20px 20px', maxWidth: '350px'}}>
                <div className="alert-header">
                    <div style={{background: calculatePriorityColor(data.priority) }} className="priority-circle"></div>
                    <p className="text alert-title">{data.title}</p>
                    <i onClick={onCloseAlert} className="alert-close-icon fa-regular fa-circle-xmark"></i>
                </div>
                <div className="alert-content">
                    <p className="alert-message">{data.message} this is a very loing message</p>
                </div>
            </ButtonBase>
        </div>
    )
}