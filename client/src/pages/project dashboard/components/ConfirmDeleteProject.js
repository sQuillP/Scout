import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Typography, 
    Button,
    Box,
} from "@mui/material"
import {  useState } from "react";
import { useSelector } from "react-redux"


export default function ConfirmDeleteProject({open, onClose, onConfirm}) {

    const project = useSelector((store)=> store.project.currentProject);

    const [deleteString, setDeleteString] = useState('');


    const inputStyle = {
        fontFamily:'inherit',
        width:'100%',
        boxSizing:'border-box',
        padding:'10px',
        fontSize:'1.1rem',
        outline:'none',
        border:'2px solid gray',
        borderRadius:'5px'
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                <Typography fontSize={'1.5rem'}>
                Are you sure you want to delete this project: <span style={{fontWeight:'bold'}}>{project.title}?</span>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography color={'black'} margin={"10px 0"} variant="body2" fontSize={'1.1rem'}>All subsequent information regarding {project.title} will be completely wiped. This action cannot be undone</Typography>
                <Typography color={'black'} margin={'15px 0'} variant="body2" fontSize={'1.1rem'}>Re-Type the name of the project "<strong>{project.title}</strong>" and then click Delete</Typography>
                <Box>
                    <input 
                        id="_" 
                        type="text" 
                        value={deleteString} 
                        onChange={(e)=> setDeleteString(e.target.value)} 
                        style={inputStyle}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    color='error'
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    onClick={onConfirm}
                    disabled={project.title !== deleteString}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}