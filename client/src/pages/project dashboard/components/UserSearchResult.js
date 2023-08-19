import {
    Paper,
    Avatar,
    Typography,
    IconButton,
    Box,
    Tooltip,
    Stack
} from '@mui/material';

import {
    HourglassTop,
    GroupAdd
} from '@mui/icons-material'



export default function UserSearchResult({handleInvite, user}) {

    const paperSX = { 
        boxSizing:'border-box' ,
        display:'flex', 
        alignItems:'center', 
        justifyContent:'space-between', 
        padding: '10px',
        width: '100%',
        maxWidth:'450px',
        cursor:'pointer',
        margin: '7px auto'
    };



    return (
        <Paper sx={paperSX} elevation={1}>
            <Stack direction={'row'} alignItems={'center'}>
                <Avatar sx={{height:'30px',width:'30px'}}>
                    {user.firstName[0]+user.lastName[0]}
                </Avatar>
                <Box whiteSpace={'wrap'} marginLeft={'10px'}>
                    <Typography  fontSize={'0.75em'}>{user.firstName + " " + user.lastName}</Typography>
                    <Typography fontSize={'0.65rem'}>{user.email}</Typography>
                </Box>
            </Stack>
            <Tooltip title='Invite user to group'>
                <IconButton size='small' onClick={handleInvite}>
                    <GroupAdd fontSize='0.9rem'/>
                </IconButton>
            </Tooltip>
        </Paper>
    )
}