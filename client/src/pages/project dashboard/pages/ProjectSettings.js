import {useState, useEffect} from 'react';

//mui components
import {
    FormControlLabel,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    IconButton,
    Tooltip,
    Stack,
    Snackbar,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,


} from '@mui/material';

import {
 //icons
 ExpandMore,
 ContentCopy,
 Visibility, 
 VisibilityOff,
 Autorenew,
 Key

} from '@mui/icons-material'


import "../styles/ProjectSettings.css";


export default function ProjectSettings() {

    const [projectDescription, setProjectDescription] = useState('Exercitation non occaecat aliqua est sint do tempor amet tempor duis deserunt velit id aliqua. Commodo non amet commodo deserunt sint id minim sunt sit. Nisi qui culpa ullamco ex reprehenderit excepteur ut sit et. Aliquip nulla in ad labore reprehenderit.');
    const [projectTitle, setProjectTitle] = useState('This is a demo title');

    const [copyHoverMessage, setCopyHoverMessage] = useState('Copy to clipboard');
    const APIKey = 'asdcjasdcpI&)(*&asdc9p8as7ydc)(*&naoslkdcalkJHLKJHCOIUCY7890)(*CX&HlkjHXOL';

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);



    const [viewApiKey, setViewApiKey] = useState(false);


    /* Update the project details */
    function onUpdateProjectDetails(){

    }

    function handleClipBoardClick() {
        navigator.clipboard.writeText(APIKey);
        setShowSnackbar(true);
    }


    function onConfirmRefreshAPIKey() {


        setShowDialog(false);

    }

    return (
        <div className="ps-container">
            <Snackbar
                open={showSnackbar}
                onClose={()=> setShowSnackbar(false)}
                autoHideDuration={2000}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Paper sx={{padding: '15px'}} elevation={3}>
                    <Typography>API key copied to clipboard!</Typography>
                </Paper>
            </Snackbar>
            <Dialog
                open={showDialog}
                onClose={()=> setShowDialog(false)}

            >
                <DialogTitle>
                    <p  className="text settings-dialog-title">Generate new API key for this project?</p>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Please note that after performing these actions, you must update to the latest API key instance in your project.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            textTransform:'none',
                        }}
                        onClick={()=> setShowDialog(false)}
                        color='error'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            textTransform:'none'
                        }}
                        onClick={onConfirmRefreshAPIKey}
                    >
                        Confirm
                    </Button>
                </DialogActions>

            </Dialog>
            <div className="ps-header">
                <p className="ps-title text">Project Settings</p>
            </div>
            <div className="ps-flex-layout">

                <Paper sx={{padding:'20px', boxSizing:'border-box'}} elevation={0}>
                    <div className="ps-intro">
                        <p className="text">Project Information</p>
                    </div>
                    {/* If there are more fields to modify, add them to the table */}
                    <table>
                        <tbody>
                        <tr>
                            <th>
                                <p style={{fontWeight:'normal'}} className="text">Project Title <span className='required'>*</span></p>
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
                <div className="project-settings">
                    <Accordion  elevation={2}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                        >
                            <Typography fontWeight={'bold'}>Credentials</Typography>
                            <Key style={{color:'gray', marginLeft: '10px'}}/>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="settings-key-wrapper">
                                <label className='settings-api-label'>Project API key:</label>
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                    flexWrap={'wrap'}
                                >
                                    <Typography className={`${viewApiKey===false?'blur':''}`}>
                                        {APIKey}
                                    </Typography>
                                    <Tooltip
                                        title={viewApiKey?"Hide API credentials":"View API credential"}
                                    >
                                        <IconButton
                                            onClick={()=> setViewApiKey((currentVisibility)=> !currentVisibility)}
                                        >
                                            {
                                                viewApiKey === true ?(
                                                    <VisibilityOff/>
                                                ): (<Visibility/>)
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip 
                                        title={copyHoverMessage}
                                    >
                                        <IconButton
                                            onClick={handleClipBoardClick}
                                        >
                                            <ContentCopy/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title={'Generate new API key'}
                                    >
                                        <IconButton
                                            onClick={()=>setShowDialog(true)}
                                        >
                                            <Autorenew/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}