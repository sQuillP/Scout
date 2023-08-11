import { Box, Paper, Stack, Typography } from "@mui/material";

import SearchOffIcon from '@mui/icons-material/SearchOff';


export default function EmptyTable({message = 'No data available'}) {


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
                <SearchOffIcon
                    sx={{fontSize:'3rem'}}                    
                />
                <Typography>{message}</Typography>
            </Stack>
        </Paper>
    )
}