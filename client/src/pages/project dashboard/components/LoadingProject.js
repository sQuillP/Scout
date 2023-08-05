import {
    Box,
    CircularProgress,
    Paper,
    Typography
} from '@mui/material';




export default function LoadingProject() {


    return (
        <Paper sx={{height:'100vh', display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Box textAlign={'center'}>
                <CircularProgress />
                <Typography>Loading project details...</Typography>
            </Box>
        </Paper>
    )
}