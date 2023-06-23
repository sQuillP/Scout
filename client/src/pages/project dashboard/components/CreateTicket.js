import { Box, Paper, Typography, Button } from "@mui/material";

import "../styles/CreateTicket.css";
import { useState } from "react";


export default function CreateTicket() {

    const [ticketForm, setTicketForm] = useState({
        ticketType:'',
        briefDescription:'',
        description:'',
        priority:''
    });


    function onSubmit(e) {
        e.preventDefault();
        console.log('submitting');
        //create submission form
    }

    return (
      <div className="ct-container">
        <div className="ct-end ct-header">
            <Typography color={'white'} variant="h4">Create New Ticket</Typography>
        </div>
        <div className="ct-form-body">
            <form onSubmit={onSubmit}>
                <div className="ct-input-row">
                    <label htmlFor="_ct-type">Ticket Type <span className="required">*</span></label>
                    <select className="ct-select">
                        <option value="bug">Bug</option>
                        <option value="crash">Crash</option>
                        <option value="task">Task</option>
                        <option value="change">Change</option>
                    </select>
                </div>
                <div className="ct-input-row">
                    <label htmlFor="_ct-priority">Priority <span className="required">*</span></label>
                    <select name="" id="" className="ct-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="ct-input-row">
                    <label htmlFor="_ct-title">Brief description <span className="required">*</span></label>
                    <input type="text" className="ct-input" />
                </div>
            </form>
        </div>
        <div className="ct-end ct-footer">
            <Button sx={{textTransform:'unset', marginRight:'10px'}} variant="contained" color="error" size="medium">
                Cancel
            </Button>
            <Button 
                sx={{textTransform:'unset'}}
                size='medium' 
                variant='contained'
                color="success"
                type="submit"
            >Create Ticket</Button>
        </div>
      </div>
    );
}