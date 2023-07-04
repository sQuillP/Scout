import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import {
    Chip,
} from '@mui/material';

import {
    ErrorOutline,
    BugReport,
    Construction,
    ChangeCircle,
} from '@mui/icons-material';

import "../styles/ViewTicket.css";
import TicketComment from "../components/TicketComment";



/* Given the ticket type: bug, fix, crash, or build, the iconSwitch will return 
the appropriate icons. */
function IconSwitch({ticketType,}) {
    switch(ticketType){
        case "bug":
            return <BugReport/>;
        case "crash":
            return <ErrorOutline/>;
        case "task":
            return <Construction/>;
        case "change":
            return <ChangeCircle/>
        default: return null;
    }
}


export default function ViewTicket() {

    //number of comments to be paginated.
    const comments_pagination = 5;

    const { ticketId } = useParams();

    const [ticketInfo, setTicketInfo] = useState({
        ticketType:'bug',
        briefDescription:'This is the description Aliquip fugiat eu cupidatat pariatur. Do ullamco anim dolore id ut excepteur proident magna occaecat sint. Ea minim veniam nisi aliquip laboris ea exercitation nostrud aliqua sint nisi officia exercitation. Ad pariatur deserunt veniam ad id et ex amet incididunt aliquip laboris laborum qui adipisicing. Ipsum commodo sunt ut tempor est eiusmod aute irure eu proident quis ullamco aute.',
        summary:'React application keeps crashing for no reason at all',
        priority:'high',
        assignTo: {
            email:'will.m.pattison@gmail.com',
            username: 'william',
            id:1,
        },
        createdOn:'02/26/1999',
        lastUpdated: '03/14/1999'
    });

    //set state for ticket comments
    const [ticketComments, setTicketComments] = useState([1,2,3,4,5]);

    //get pagination for the number of comments


    useEffect(()=> {
        //async request to get the ticket information using the ticketId params.

        //get the comments associated with the ticket, make sure to include pagination
        //to the results
    },[]);


    function getPriorityColor(priority) {
        switch(priority){
            case "high":
                return 'error';
            case "medium":
                return "warning";
            case "low":
                return "success";
        }
    }

    console.log(ticketId);



    return (
        <div className="vt-container">
            <div className="vt-header">
                <p className="text">
                    {ticketInfo.summary}
                </p>
            </div>
            <div className="vt-flex-container">
                <div className="vt-flex-col">
                    <div className="vt-section">
                        <p className="text vt-section-label">Details</p>
                        
                        <table style={{textAlign:'left', padding: '10px', overflowX:'auto'}}>
                            <tbody>
                                <tr className="vt-tr">
                                    <th className="vt-th-label">Assigned to</th>
                                    <td className="vt-td-value">{ticketInfo.assignTo.email}</td>
                                </tr>
                                <tr className="vt-tr">
                                    <th className="vt-th-label">Priority</th>
                                    <td className="vt-td-value">
                                        <Chip 
                                            variant="outlined" 
                                            color={getPriorityColor(ticketInfo.priority)}
                                            label={ticketInfo.priority}
                                            size="small"
                                        />
                                    </td>
                                </tr>
                                <tr className="vt-tr">
                                    <th className="vt-th-label">Ticket type</th>
                                    <td style={{display:'flex', alignItems:'center'}}  className="vt-td-value">
                                        <IconSwitch
                                            ticketType={ticketInfo.ticketType}
                                        />
                                        {ticketInfo.ticketType}
                                    </td>
                                </tr>
                                <tr className="vt-tr">
                                    <th className="vt-th-label">Created on</th>
                                    <td className="vt-td-value">
                                        <p className="text vt-smalltext">
                                            {ticketInfo.createdOn}
                                        </p>
                                    </td>
                                </tr>
                                <tr className="vt-tr">
                                    <th className="vt-th-label">Last updated</th>
                                    <td className="vt-td-value">
                                        <p className="text vt-smalltext">
                                            {ticketInfo.lastUpdated}
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Description</p>
                        <div className="vt-description-wrapper">
                            <p className="text vt-description">
                                {ticketInfo.briefDescription}
                            </p>
                        </div>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Ticket History</p>
                        <div className="vt-activity-wrapper">
                        </div>
                    </div>
                </div>
                <div className="vt-flex-col">
                    <div className="vt-section">
                        <p className="text vt-section-label">Comments</p>
                        <div className="vt-section-comments">
                            {ticketComments.map(comment=> {
                                return <TicketComment/>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}