import {useState, useEffect} from 'react';

//mui components
import {
    FormControlLabel,
    Paper,
} from '@mui/material';

import {
 //icons
} from '@mui/icons-material'


import "../styles/ProjectSettings.css";


export default function ProjectSettings() {

    const [projectDescription, setProjectDescription] = useState('Exercitation non occaecat aliqua est sint do tempor amet tempor duis deserunt velit id aliqua. Commodo non amet commodo deserunt sint id minim sunt sit. Nisi qui culpa ullamco ex reprehenderit excepteur ut sit et. Aliquip nulla in ad labore reprehenderit.');
    const [projectTitle, setProjectTitle] = useState('This is a demo title');

    /* Update the project details */
    function onUpdateProjectDetails(){

    }

    return (
        <div className="ps-container">
            <div className="ps-header">
                <p className="ps-title text">Project Settings</p>
            </div>
            <Paper sx={{padding:'20px', boxSizing:'border-box'}} elevation={3}>
                <div className="ps-intro">
                    <p className="text">Project Information</p>
                </div>
                {/* If there are more fields to modify, add them to the table */}
                <table>
                    <tbody>
                    <tr>
                        <th>
                            <p className="text">Project Title <span className='required'>*</span></p>
                        </th>
                        <td>
                            <input 
                                type='text' 
                                className='ps-input' 
                                value={projectTitle}
                                onChange={(e)=> setProjectTitle(e.target.value)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="ps-description-wrapper">
                    <label htmlFor="">
                        Description <span className="required">*</span>
                    </label> <br/>
                    <textarea 
                        className='ps-description'
                        value={projectDescription}
                        onChange={(e)=> setProjectDescription(e.target.value)}
                    ></textarea>
                </div>
            </Paper>
        </div>
    )
}