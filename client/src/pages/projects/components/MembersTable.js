import {
    Avatar,
    TableContainer, 
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Tooltip,
    Modal,
    Paper,
    Button,
    Typography,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';


const modalSX = {
    position:'absolute',
    top:'50%',
    left:'50%',
    transform:'translate(-50%,-50%)',
    width: 400,
    bgcolor: 'background.paper',
    p:4
};



export default function MembersTable({data, onDeleteRow}) {

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [removeUser, setRemoveUser] = useState(null);

    function onOpenConfirmModal(userToRemove) {
        setOpenConfirmModal(true);
        setRemoveUser(userToRemove);
    }

    function getRemoveConfirmation(removeUser) {

    }

    function onRemoveUser() {
        if(removeUser===null) return;
        console.log('removing user', removeUser);
        onDeleteRow(removeUser);
    }

    return (
        <>
            <Modal
                open={openConfirmModal}
                onClose={()=> setOpenConfirmModal(false)}
            >
                <Paper sx={modalSX} elevation={3}>
                    <Typography variant='h4' marginBottom={'10px'} align='center'>Remove This user?</Typography>
                    <Typography borderBottom={'1px solid lightgray'} paddingBottom={'10px'} marginBottom={'20px'} align='center'>The user will no longer be in this group. You can always re-add them by searching for their credentials.</Typography>
                    <Box display={'flex'} justifyContent={'center'}>
                        <Button onClick={onRemoveUser} variant='contained' sx={{marginRight:'10px'}} color='primary'>Yes</Button>
                        <Button onClick={()=> setOpenConfirmModal(false)} variant='contained' sx={{marginRight:'10px'}} color='error'>No</Button>
                    </Box>
                </Paper>
            </Modal>
            <TableContainer>
                <Table
                    sx={{maxWidth:'600px', margin:'0 auto'}}
                    size='small'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((member)=> {
                            return (
                                <TableRow
                                    key={member.id}
                                >
                                    <TableCell sx={{display:'flex', alignItems:'center'}}>
                                        <Avatar
                                            sx={{height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'}}>
                                                WP
                                        </Avatar>
                                        <p className="text">William Pattison</p>
                                    </TableCell>
                                    <TableCell>will.m.pattison@gmail.com</TableCell>
                                    <TableCell>
                                        <select className="pm-role-select">
                                            <option value="developer" className="pm-role-option">Developer</option>
                                            <option value="pm" className="pm-role-option">
                                                Project Manager
                                            </option>
                                            <option value="admin" className="pm-role-option">
                                                Administrator
                                            </option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip onClick={()=> onOpenConfirmModal(member)}
                                            title='remove user'>
                                            <IconButton size='small'>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}