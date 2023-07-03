import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

import "../styles/ViewTicket.css";


export default function ViewTicket() {

    const { ticketId } = useParams();

    const [ticketInfo, setTicketInfo] = useState({
        ticketType:'',
        briefDescription:'',
        summary:'React application keeps crashing for no reason at all',
        priority:'high',
        assignTo: {
            email:'will.m.pattison@gmail.com',
            username: 'william',
            id:1,
        }
    });


    useEffect(()=> {
        //async request to get the ticket information using the ticketId params.
    },[]);

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
                        <p className="text vt-section-label">Assigned to</p>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Details</p>
                        
                        <table style={{textAlign:'left'}}>
                            <tbody>
                                <tr>
                                    <th>Name:</th>
                                    <td>Bill Gates</td>
                                </tr>
                                <tr>
                                    <th>Telephone:</th>
                                    <td>555 77 854</td>
                                </tr>
                                <tr>
                                    <th>Telephone:</th>
                                    <td>555 77 855</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="vt-section">
                        <p className="text vt-section-label">Description</p>
                    </div>
                </div>
                <div className="vt-flex-col">
                    <div className="vt-section">
                    </div>
                </div>
            </div>
        </div>
    )
}