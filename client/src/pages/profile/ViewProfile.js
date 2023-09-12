import { useSelector, useDispatch } from "react-redux"
import { 
    Typography,
    Stack,
    CircularProgress,
    Button,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import "./ViewProfile.css";
import "./styles/ProfileField.css";

import { AccountCircle, LockResetSharp, ArrowBackSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { userSchema, initialValues } from "./validation";
import ProfileField from "./components/ProfileField";
import { useEffect, useState } from "react";
import Scout from "../../axios/scout";
import {isEqual} from 'lodash';
import HorizontalNavigation from '../../components/HorizontalNavigation';
import { useNavigate } from "react-router-dom";

const fieldKeys = ['firstName','lastName','profileImage','password','email'];


export default function ViewProfile() {

    const profile = useSelector((store)=> store.auth.user)
    const [showPageDetail, setShowPageDetail] = useState(false);
    const [initialToggle, setInitialToggle] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false); 
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [openDialog, setOpenDialog] = useState(false);

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [viewPassword, setViewPassword] = useState(false);
    const [viewNewPassword, setViewNewPassword] = useState(false);


    const navigation = useNavigate();


    useEffect(()=> {
        if(profile !== null) {
            setShowPageDetail(true);
        }
    },[profile]);

    async function onUpdateUser(form) {
        setInitialToggle((t)=> !t);
        const original = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            profileImage: profile.profileImage || "",
            password: "",
            newPassword:''
        }
        if(isEqual(form, original)){
            onOpenSnackbar("error", "Profile details have not been modified");
            return;
        }

        try {
            //async request.
            return;
        } catch(error) {
            console.log(error, error.message);
            onOpenSnackbar("error","Unable to update profile details");
        }

        console.log(form);
    }

    function onClearEditModes(setEditMode) {
        setEditMode(false);
    }

    function handleReset(setFieldValue) {
        if(profile  === null) return;
        fieldKeys.forEach((field)=> {
            setFieldValue(field,profile[field] || "");
        });
        setFieldValue('confirmPassword','');
        setInitialToggle(initialToggle => !initialToggle);
    }

    function onOpenSnackbar(severity, message) {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    function onChangePassword() {
        console.log('changing password');
        setOpenDialog(true);
    }


    function onCloseDialog() {
        //more actions
        setOpenDialog(false);
        setNewPassword('');
        setPassword('');
    }


    async function requestPasswordChange() {
        try {
            // const response =
            // make server request
        } catch(error) {

        }
    }

    function enablePasswordChange() {
        console.log(password, newPassword)
        return password === newPassword || newPassword === '' || password === '' 
    }


    console.log(profile);
    return (
        <>
        <HorizontalNavigation/>
        <Dialog
            open={openDialog}
            onClose={onCloseDialog}
        >
            <DialogTitle padding={0}>
                Change Password
            </DialogTitle>
            <DialogContent>
                <div className="vp-input-container">
                    <label htmlFor="_cur_password">Enter Password</label>
                    <input 
                        type={viewPassword?'text':'password'} 
                        onChange={(val)=> setPassword(val.target.value)} 
                        value={password}
                        className="vp-pf-input"
                        id="_cur_password"
                    />
                    <IconButton 
                        sx={{
                            position:'absolute',
                            right:'10px',
                            top:'25px'
                        }}
                    onClick={()=> setViewPassword(!viewPassword)} size="small">
                        {
                            viewPassword ? <VisibilityOff/> : <Visibility/>
                        }
                    </IconButton>
                </div>
                <div className="vp-input-container">
                    <label htmlFor="_new_password">Enter New Password</label>
                    <input 
                        type={viewNewPassword?'text':'password'} 
                        onChange={(val)=> setNewPassword(val.target.value)} 
                        className="vp-pf-input" 
                        value={newPassword}
                        id="_new_password"
                    />
                    <IconButton 
                        sx={{
                            position:'absolute',
                            right:'10px',
                            top:'25px'
                        }}
                        onClick={()=> setViewNewPassword(!viewNewPassword)} size="small">
                        {
                            viewNewPassword ? <VisibilityOff/> : <Visibility/>
                        }
                    </IconButton>
                </div>
            </DialogContent>
            <DialogActions>
                <Button 
                    sx={{
                        textTransform:'initial'
                    }} 
                    variant="outlined"
                    color="error"
                    onClick={onCloseDialog}>Cancel</Button>
                <Button 
                    sx={{
                        textTransform:'initial'
                    }} 
                    variant="outlined" 
                    onClick={onChangePassword}
                    color='success'
                    disabled={enablePasswordChange()}
                >Change password</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={()=> setSnackbarOpen(false)}
            anchorOrigin={{horizontal:'center', vertical:'bottom'}}
        >
            <Alert severity={snackbarSeverity}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        {
            showPageDetail === true ? (
                <div className="vp-container">
                    <Stack
                        sx={{
                            position: 'absolute',
                            top: '120px',
                            left: '20px',
                        }}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                    >
                        <IconButton size="small">
                            <ArrowBackSharp sx={{fontSize:'1.8rem'}} color="lightgray"/>
                        </IconButton>
                        <Typography fontSize={'1.3rem'} color={'gray'} variant="body2">Back</Typography>
                    </Stack>
                    <div className="vp-color-header">
                        <Typography color={'white'} variant="h3" textAlign={'center'}>My Profile</Typography>
                    </div>
                    <div className="vp-section">
                        <Stack 
                            direction={'column'} 
                            alignItems={'center'} 
                            justifyContent={'center'}
                        >
                            {
                                (()=> {
                                    if(profile.profileImage !== null){
                                        return (
                                            <img className="vp-image" src={profile.profileImage}/>
                                        )
                                    } else {
                                        return (
                                                <AccountCircle 
                                                    sx={{height: '200px', width: '200px', color:'gray'}} 
                                                />
                                        )
                                    }
                                })()
                            }
                            <Typography fontSize={'1.5rem'} variant="body2">{profile.firstName + " " + profile.lastName}</Typography>
                            <Typography fontSize={'1.5rem'} variant="body2">{profile.email}</Typography>
                        </Stack>
                    </div>
                    <div className="vp-section">
                            <Typography fontSize={'1.5rem'} variant="body2" color={'black'} textAlign={"left"}>Profile Details</Typography>
                            <Formik
                                initialValues={{
                                    firstName: profile.firstName,
                                    lastName: profile.lastName,
                                    email: profile.email,
                                    profileImage: profile.profileImage || "",
                                    password: profile.password || "",
                                    newPassword:''
                                }}
                                onSubmit={onUpdateUser}
                            >
                            {
                                (formik)=>{
                                    const { setFieldValue } = formik;
                                    return (
                                        <Form>
                                            <div className="vp-form-container">
                                                <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'}>
                                                    {/* <div className="vp-form-col"> */}
                                                        <ProfileField
                                                            formik={formik} 
                                                            label={"First Name"} 
                                                            fieldLabel={"firstName"}
                                                            initialToggle={initialToggle}
                                                        />
                                                        <ProfileField 
                                                            formik={formik} 
                                                            label={"Last Name"} 
                                                            fieldLabel={"lastName"}
                                                            initialToggle={initialToggle}

                                                        />
                                                        <ProfileField 
                                                            formik={formik} 
                                                            label={"Email"} 
                                                            fieldLabel={"email"}
                                                            initialToggle={initialToggle}

                                                        />
                                                        <ProfileField
                                                            label={'Profile Image'}
                                                            fieldLabel={'profileImage'}
                                                            formik={formik}
                                                            initialToggle={initialToggle}
                                                        />
                                                       <button type="button" onClick={onChangePassword} className="vp-change-password">Change Password &nbsp;&nbsp;<LockResetSharp style={{fontSize:'2rem'}}/></button>
                                                        
                                                    {/* </div> */}
                                                </Stack>
                                                
                                                <Stack marginTop={'30px'} direction={'row'} justifyContent={'center'} paddingTop={'15px'} gap={1}>
                                                    <button className="vp-btn vp-update" type='submit'>Update</button>
                                                    <button type="button" className="vp-btn vp-cancel" onClick={()=> handleReset(setFieldValue)}>Clear Changes</button>
                                                    {/* <button type="button" onClick={()=> console.log(password, newPassword)}>debug</button> */}
                                                </Stack>
                                            </div>
                                        </Form>
                                    )
                                }
                            }
                            </Formik>
                    </div>
                </div>
            ) : (
                <div className="vp-container">
                    <div className="vp-loading">
                        <CircularProgress sx={{height: '50px', width:'50px', marginBottom:'25px'}}/>
                        <Typography fontSize={'1.0rem'} variant="body2">Loading Profile details</Typography>
                    </div>
                </div>
            )
        }
        </>
    )
}