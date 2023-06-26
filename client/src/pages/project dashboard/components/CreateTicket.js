import { 
    Typography,
    Button, 
    Autocomplete,
    TextField,
} from "@mui/material";

import "../styles/CreateTicket.css";
import { useState } from "react";


const dummy_data = [
    {
        email:'will.m.pattison@gmail.com',
        username: 'william',
        id:1,
    },
    {
        email:'bob@gmail.com',
        username: 'william',
        id:12,
    },
    {
        email:'samuel@example.com',
        username: 'william',
        id:13,
    },
    {
        email:'person@yahoo.com',
        username: 'william',
        id:14,
    },
];



const MAX_SUMMARY_CHAR_COUNT = 75;

export default function CreateTicket({onCancelTicket }) {

    const [ticketForm, setTicketForm] = useState({
        ticketType:'',
        briefDescription:'',
        summary:'',
        priority:'',
        assignTo:null,
    });

    const [confirmModal, setConfirmModal] = useState(false);


    function handleTicketChange(field,value) {
        //ensure less than 75 character count.
        if(field ==='summary' && value.length>=MAX_SUMMARY_CHAR_COUNT+1)
            return;

        setTicketForm((oldForm)=> {
            return{
                ...oldForm, 
                [field]:value
            }
        });
    }


    function onSubmit(e) {

        console.log('submitting');
        //create submission form
    }

    return (
        <div className="ct-container">
            <div className="ct-end ct-header">
                <Typography color={'white'} variant="h4">Create New Ticket</Typography>
            </div>
            <div className="ct-form-body">
                    <div className="ct-input-row">
                        <label className="ct-label" htmlFor="_ct-type">Ticket Type <span className="required">*</span></label>
                        <select 
                            onChange={(e)=> handleTicketChange('ticketType',e.target.value)} 
                            className="ct-select"
                        >
                            <option value="bug">Bug</option>
                            <option value="crash">Crash</option>
                            <option value="task">Task</option>
                            <option value="change">Change</option>
                        </select>
                    </div>
                    <div className="ct-input-row">
                        <label className="ct-label" htmlFor="_ct-priority">Priority <span className="required">*</span></label>
                        <select 
                            onChange={(e)=> handleTicketChange('priority',e.target.value)}
                            value={ticketForm.priority}
                            name="" 
                            id="_ct-priority" 
                            className="ct-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="ct-input-row">
                        <label className="ct-label" htmlFor="_ct-title">Ticket Summary <span className="required">*</span></label>
                        <input 
                            onChange={(e)=> handleTicketChange('summary',e.target.value)} 
                            type="text" 
                            className="ct-input" 
                            placeholder="Provide a brief summar/overview of the ticket in mo more than 50 characters"
                            value={ticketForm.summary}
                        />
                        <p 
                            className="text"
                            style={{fontSize:'0.7rem',color:'gray',fontStyle:'italic'}}
                        >{ticketForm.summary.length}/{MAX_SUMMARY_CHAR_COUNT} characters</p>
                    </div>
                    <div className="ct-input-row">
                        <label htmlFor="" className="ct-label">Assign to <span className="required">*</span></label>
                        <Autocomplete
                            onChange={(e,value)=> handleTicketChange('assignTo',value)}
                            size="small"
                            getOptionLabel={(option)=> option.email}
                            options={dummy_data}
                            renderInput={(options)=> <TextField {...options} variant="standard" />}
                        />
                    </div>
                    <div className="ct-input-row">
                        <label htmlFor="_ct-description" className="ct-label">Description <span className="required">*</span></label>
                        <textarea 
                            id="_ct-description" 
                            name="ct-description" 
                            className="ct-textarea"
                            placeholder="Please provide all necessary details for this ticket."
                        ></textarea>
                    </div>
            </div>
            <div className="ct-end ct-footer">
                <Button onClick={onCancelTicket} sx={{textTransform:'unset', marginRight:'10px'}} variant="contained" color="error" size="medium">
                    Cancel
                </Button>
                <Button 
                    sx={{textTransform:'unset'}}
                    size='medium' 
                    variant='contained'
                    color="success"
                    type="submit"
                    onClick={onSubmit}
                >Create Ticket</Button>
            </div>
        </div>
    );
}