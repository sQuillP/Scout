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
    Switch,


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

import { useSelector } from 'react-redux';

import Scout from '../../../axios/scout';

import "../styles/ProjectSettings.css";


export default function ProjectSettings() {

    const project = useSelector((store)=> store.project.currentProject);


    const [copyHoverMessage, setCopyHoverMessage] = useState('Copy to clipboard');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');



    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogConfirm, setDialogConfirm] = useState(null);

    const [viewApiKey, setViewApiKey] = useState(false);


    /* For edit mode */
    const [editMode, setEditMode] = useState(false);

    const initialSettings = {
        title: project.title,
        description: project.description,
        APIKey: project.APIKey
    };

    const [projectDetails, setProjectDetails] = useState(initialSettings);

    //for edit mode
    //show projectDetails
    //if close edit mode without saving, set project details back to original

    function updateProjectDetails(field, value) {
        setProjectDetails({...projectDetails, [field]:value});
    }




    /* Update the project details */
    async function onUpdateProjectDetails(){
        try{

        } catch(err){

        }
    }

    function switchEditMode() {
        if(editMode === true){
            setProjectDetails(initialSettings);
        }
        setEditMode(!editMode);
    }
    

    function handleClipBoardClick() {
        navigator.clipboard.writeText(project.APIKey);
        setShowSnackbar(true);
    }


    async function refreshAPIKey() {

        setShowDialog(false);
    }

    function toggleRefreshKeyDialog() {
        setDialogConfirm(()=> refresAPIK)
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
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <p className="ps-title text">Project Settings</p>
                    <FormControlLabel 
                        checked={editMode} 
                        value={editMode} 
                        onChange={switchEditMode} 
                        control={<Switch />}
                        label="Allow Editing"
                        />
                </Stack>
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
                                <p style={{fontWeight:'normal'}} className="text ps-label">Project Title <span className='required'>* &nbsp;</span></p>
                            </th>
                            <td>
                                {
                                    editMode === true ? (
                                        <input 
                                            type='text' 
                                            className='ps-input' 
                                            value={projectDetails.title}
                                            onChange={(e)=> updateProjectDetails('title',e.target.value)}
                                        />
                                    ) : (
                                        <Typography variant='body2' margin={'20px 0px'} fontSize={'1.3rem'}>{project.title}</Typography>
                                    )
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="ps-description-wrapper">
                        <label className='ps-label' htmlFor="">
                            Description <span className="required">*</span>
                        </label> <br/>
                        {
                            editMode === true ? (
                                <textarea 
                                    className='ps-description'
                                    value={projectDetails.description}
                                    onChange={(e)=> updateProjectDetails('description',e.target.value)}
                                ></textarea>
                            ): (
                                <Typography fontSize={'1.3rem'} margin={'20px 0px'} variant='body2'>{project.description}</Typography>
                            )
                        }
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
                                        {project.APIKey}
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
            <div className={`vt-submit-changes-container`}>
                
                    <button
                        className={`vt-submit-changes  ${ showConfirmTicketChangesModal?'vt-submit-disabled':''}`}
                        onClick={onDisplayConfirmTicketModal}
                        disabled={showConfirmTicketChangesModal}
                    >
                        Publish Changes
                        <Publish
                            style={{marginLeft:'10px'}}
                        />
                    </button>
                    {
                        showConfirmTicketChangesModal && (
                            <CircularProgress
                                color="success"
                                size={'1.5rem'}
                                sx={{
                                    position:'absolute',
                                    top:'-2px',
                                    left:'40%',
                                    margin:'10px 0 0 10px',
                                }}
                            />
                        )
                    }
                </div>
        </div>
    )
}