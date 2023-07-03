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

/**
 * @description - Create a new ticket request for a user.
 * @param {()=> void} onCloseTicketForm - function that accepts a boolean, tells parent whether or not form was successfully submitted.
 */

export default function CreateTicket({onCloseTicketForm}) {

    const emptyForm = {
        ticketType:'',
        briefDescription:'',
        summary:'',
        priority:'',
        assignTo:null,
    };

    const [ticketForm, setTicketForm] = useState(emptyForm);

    const [formErrors, setFormErrors] = useState({});

    const keyMap = {
        ticketType: 'Ticket Type',
        briefDescription:'Brief Description',
        summary:'Summary',
        priority:'Priority',
        assignTo:'Assign To'
    };

    function handleTicketChange(field,value) {
        //ensure less than 75 character count.
        if(field ==='summary' && value.length>=MAX_SUMMARY_CHAR_COUNT+1)
            return;

        if(field === 'assignTo' || value.trim() !== ''){
            setFormErrors((oldFormErrors)=> {
                delete oldFormErrors[field];
                return {...oldFormErrors};
            });
        }

        setTicketForm((oldForm)=> {
            return{
                ...oldForm, 
                [field]:value
            }
        });
    }


    /* Return true if there are empty fields present. Update state as well to 
    reflect in ui accordingly */
    function validateRequiredFields() {
        let hasNoEmptyFields = false;
        Object.keys(ticketForm).forEach((key)=> {
            //cannot be null or empty
            if(key ==='assignTo' && ticketForm[key] == null){
                setFormErrors((formErrors)=> {
                    return {...formErrors,[key]: `${keyMap[key]} cannot be empty`};
                });
                hasNoEmptyFields = true;
            }
            //if empty string or only spaces
            if(key !== 'assignTo' && ticketForm[key].trim() === ''){
                setFormErrors((formErrors)=> {
                    return {...formErrors, [key]: `${keyMap[key]} is required`};
                });
                hasNoEmptyFields = true;
            }
        });
        return hasNoEmptyFields;
    }


    function onSubmit(e) {

        if(validateRequiredFields() === true) return;

        console.log('submitting');
        onCloseTicketForm(true);
    }


    return (
        <div className="ct-container">
            <div className="ct-end ct-header">
                <Typography color={'white'} variant="h4">Create New Ticket</Typography>
            </div>
            <div className="ct-form-body">
                    <div className="ct-input-row">
                        <label className="ct-label" htmlFor="_ct-type">Ticket Type <span className="required">* {formErrors['ticketType']}</span></label>
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
                        <label className="ct-label" htmlFor="_ct-priority">Priority <span className="required">* {formErrors['priority']}</span></label>
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
                        <label className="ct-label" htmlFor="_ct-title">Ticket Summary <span className="required">* {formErrors['summary']}</span></label>
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
                        <label htmlFor="" className="ct-label">Assign to <span className="required">* {formErrors['assignTo']}</span></label>
                        <Autocomplete
                            onChange={(e,value)=> handleTicketChange('assignTo',value)}
                            size="small"
                            value={ticketForm.assignTo}
                            getOptionLabel={(option)=> option.email}
                            options={dummy_data}
                            renderInput={(options)=> <TextField {...options} variant="standard" />}
                        />
                    </div>
                    <div className="ct-input-row">
                        <label htmlFor="_ct-description" className="ct-label">Description <span className="required">* {formErrors['briefDescription']}</span></label>
                        <textarea 
                            value={ticketForm.briefDescription}
                            onChange={(e)=> handleTicketChange('briefDescription',e.target.value)}
                            id="_ct-description" 
                            name="ct-description" 
                            className="ct-textarea"
                            placeholder="Please provide all necessary details for this ticket."
                        ></textarea>
                    </div>
            </div>
            <div className="ct-end ct-footer">
                <Button onClick={()=>onCloseTicketForm(false)} sx={{textTransform:'unset', marginRight:'10px'}} variant="contained" color="error" size="medium">
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