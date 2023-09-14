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
    Box,
    Stack
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
 


export default function MembersTable({ members, onDeleteRow, updateMemberRole}) {

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [removeUser, setRemoveUser] = useState(null);

    function onOpenConfirmModal(userToRemove) {
        setOpenConfirmModal(true);
        setRemoveUser(userToRemove);
    }


    function onRemoveUser() {
        if(removeUser===null) return;
        console.log('removing user', removeUser);
        onDeleteRow(removeUser);
        setOpenConfirmModal(false);
    }


    // function onChangeUserRole()

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
                        {members.map((member)=> {
                            return (
                                <TableRow
                                    key={member._id}
                                >
                                    <TableCell>
                                        <Stack
                                            direction={'row'}
                                            justifyContent={'flex-start'}
                                            alignItems={'center'}
                                        >
                                            <Avatar
                                                sx={{height:'30px', width:'30px', fontSize:'1em', marginRight:'10px'}}>
                                                {member.firstName[0].toUpperCase() + member.lastName[0].toUpperCase()}
                                            </Avatar>
                                            <p className="text">{member.firstName + " " + member.lastName}</p>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <select onChange={(e)=> updateMemberRole(member,e.target.value)} value={member.role} className="pm-role-select">
                                            <option value="developer" className="pm-role-option">Developer</option>
                                            <option value="project_manager" className="pm-role-option">
                                                Project Manager
                                            </option>
                                            <option value="administrator" className="pm-role-option">
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