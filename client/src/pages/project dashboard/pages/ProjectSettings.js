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
 Key,
 Error,
 Done,

} from '@mui/icons-material'

import { useSelector, useDispatch } from 'react-redux';

import {isEqual} from 'lodash';

import Scout from '../../../axios/scout';

import "../styles/ProjectSettings.css";
import SubmitChangesButton from '../../../components/SubmitChangesButton';
import { updateProjectSync } from '../../../redux/slice/projectSlice';
import ConfirmDeleteProject from '../components/ConfirmDeleteProject';
import {useNavigate}from 'react-router-dom'

export default function ProjectSettings() {

    const project = useSelector((store)=> store.project.currentProject);
    const user = useSelector((store)=> store.auth.user);
    const dispatch = useDispatch();

    const [copyHoverMessage, setCopyHoverMessage] = useState('Copy to clipboard');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogConfirm, setDialogConfirm] = useState(null);
    const [didModify, setDidModify] = useState(false);
    const [viewApiKey, setViewApiKey] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Project details successfully saved");
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const [deleteProjectDialog, setOpenDeleteProjectDialog] = useState(false);
    
    const navigate = useNavigate();


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
        const updatedValue = {...projectDetails, [field]:value};
        if( isEqual(updatedValue,initialSettings) === false){
            setDidModify(true);
        }
        else{
            setDidModify(false);
        }
        setProjectDetails(updatedValue);
    }


    function onOpenSnackbar(message,severity) {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setShowSnackbar(true);
    }


    /* Update the project details */
    async function fetchProjectUpdate(){
        onCloseDialog();
        try{
            const response = await Scout.put('/projects/myProjects/'+project._id,projectDetails);
            dispatch(updateProjectSync(response.data.data));
            onOpenSnackbar("Successfully updated project details","success");
        } catch(err){
            console.log(err, err.message);
            onOpenSnackbar("Unable to update project details", "error");
        } 
    }

    function switchEditMode() {

        const foundMember= project.members.find(member=> {
            return member._id === user._id
        });

        if(foundMember.role !=='administrator') return;

        if(editMode === true){
            setProjectDetails(initialSettings);
        }
        setDidModify(false);
        setEditMode(!editMode);
    }
    

    function handleClipBoardClick() {
        navigator.clipboard.writeText(project.APIKey);
        onOpenSnackbar('API key copied to clipboard!','success');
    }



    /**
     * 
     */
    async function refreshAPIKey() {
        setShowDialog(false);
        try {
            const response = await Scout.put('/projects/myProjects/'+project._id+'/refreshAPIKey');
            dispatch(updateProjectSync(response.data.data));
            onOpenSnackbar("A new API key has been generated","success");
        } catch(error) {
            console.log(error, error.message);
            onOpenSnackbar("Unable to refresh API key. Check your network.","error");
        }
    }

    function toggleRefreshKeyDialog() {

        setDialogConfirm(()=> refreshAPIKey);
        setDialogTitle('Generate new API key for this project?');
        setDialogMessage('Please note that after performing these actions, you must update to the latest API key instance in your project.');
        setShowDialog(true);
    }

    function onCloseDialog(){
        setShowDialog(false);
        setEditMode(false);
    }

    function toggleSaveChangesDialog() {
        setDialogConfirm(()=> fetchProjectUpdate);
        setDialogTitle('Save Changes?');
        setDialogMessage("By clicking accept you will overwrite with newest changes.");
        setShowDialog(true);
    }


    async function onDeleteProject() {
        try {
            await Scout.delete('/projects/myProjects/'+project._id);
            navigate('/projects');
        } catch(error) {
            console.log(error, error.message);
            onOpenSnackbar("Unable to delete project","error");
            setOpenDeleteProjectDialog(false);
        }
    }

    return (
        <div className="ps-container">
            <Snackbar
                open={showSnackbar}
                onClose={()=> setShowSnackbar(false)}
                autoHideDuration={3000}
                anchorOrigin={{horizontal:'center', vertical:'bottom'}}
            >
                <Paper sx={{padding: '15px', display:'flex', justifyContent:'space-between'}} elevation={3}>
                    <Typography>{snackbarMessage}&nbsp;&nbsp;</Typography>
                    {
                        snackbarSeverity ==='success'?(
                            <Done sx={{color:'green'}}/>
                        ):(
                            <Error sx={{color:'red'}}/>
                        )
                    }
                </Paper>
            </Snackbar>
            <ConfirmDeleteProject
                open={deleteProjectDialog}
                onClose={()=> setOpenDeleteProjectDialog(false)}
                onConfirm={onDeleteProject}
            />
            <Dialog
                open={showDialog}
                onClose={()=> setShowDialog(false)}

            >
                <DialogTitle>
                    <p  className="text settings-dialog-title">{dialogTitle}</p>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                       {dialogMessage}
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
                        onClick={dialogConfirm}
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
                        label="Enable Editing"
                        disabled={project.userPermission.role !== 'administrator'}
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
                                    <Typography fontWeight={'bold'} className={`${viewApiKey===false?'blur':''}`}>
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
                                            onClick={toggleRefreshKeyDialog}
                                        >
                                            <Autorenew/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <Button
                    onClick={()=>setOpenDeleteProjectDialog(true)}
                    color='error'
                    variant='contained'
                    sx={{margin: '20px 0'}}
                    disabled={project.creator !== user._id}
                >
                    Delete this project
                </Button>

            </div>
            <SubmitChangesButton
                showButton={editMode}
                onClick={toggleSaveChangesDialog}
                disabled={didModify === false || showDialog === true}
                showProgress={showDialog}
            />
           
        </div>
    )
}