import {
    CommentsDisabled,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import "../styles/NewComment.css";


export default function NoComments() {
    return (
        <Box 
            display={'flex'} 
            flexDirection={'column'} 
            justifyContent={'center'} 
            alignItems={'center'}
            marginTop={'30px'}
        >
            <CommentsDisabled 
                style={{
                    color:'gray', 
                    fontSize:'2.2rem',
                    margin:'10px 0'
                }}/>
            <Typography color={'gray'}>No Comments</Typography>
        </Box>
    )
}