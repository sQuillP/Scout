import { Box, Paper, Stack, Typography } from "@mui/material";

import SearchOffIcon from '@mui/icons-material/SearchOff';

/**
 * 
 * @param {()=>React.JSX} Icon
 * @param {string} message 
 * 
 */
export default function EmptyTable({message = 'No data available', Icon}) {


    return (
        <Paper 
            elevation={2}
            sx={{
                height:'25vh',
                width:'100%',
                justifyContent:'center',
                alignItems:'center',
                display:'flex',

            }}
        >
            <Stack
                direction={'column'}
                gap={2}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Icon/>
                <Typography>{message}</Typography>
            </Stack>
        </Paper>
    )
}