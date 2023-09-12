import { useSelector, useDispatch } from "react-redux"
import { 
    Typography,
    Stack,
    CircularProgress,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import "./ViewProfile.css";
import { AccountCircle } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { userSchema, initialValues } from "./validation";
import ProfileField from "./components/ProfileField";
import { useEffect, useState } from "react";
import Scout from "../../axios/scout";
import {isEqual} from 'lodash';


const fieldKeys = ['firstName','lastName','profileImage','password','email'];


export default function ViewProfile() {

    const profile = useSelector((store)=> store.auth.user)
    const [showPageDetail, setShowPageDetail] = useState(false);
    const [initialToggle, setInitialToggle] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false); 
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
        console.log('clicked')
        console.log(form);
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

    console.log(profile);
    return (
        <>
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
                                                    sx={{height: '175px', width: '175px', color:'gray'}} 
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
                                
                                // validateOnMount
                                // validationSchema={userSchema}
                            >
                            {
                                (formik)=>{
                                    const { setFieldValue } = formik;
                                    return (
                                        <Form>
                                            <div className="vp-form-container">
                                                <Stack direction={'row'} justifyContent={'space-around'} flexWrap={'wrap'}>
                                                    <div className="vp-form-col">
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
                                                    </div>
                                                    <div className="vp-form-col">
                                                        <ProfileField 
                                                            formik={formik} 
                                                            label={"Email"} 
                                                            fieldLabel={"email"}
                                                            initialToggle={initialToggle}

                                                        />
                                                        <ProfileField 
                                                            formik={formik} 
                                                            label={"Password"} 
                                                            fieldLabel={"password"}
                                                            initialToggle={initialToggle}

                                                        />
                                                        <ProfileField 
                                                            formik={formik} 
                                                            label={"New Password"} 
                                                            fieldLabel={"newPassword"}
                                                            initialToggle={initialToggle}

                                                        />
                                                    </div>
                                                </Stack>
                                                <div className="vp-form-bottom">
                                                    <ProfileField
                                                        label={'Profile Image'}
                                                        fieldLabel={'profileImage'}
                                                        formik={formik}
                                                        initialToggle={initialToggle}
                                                    />
                                                </div>
                                                <Stack direction={'row'} justifyContent={'center'} paddingTop={'15px'} gap={1}>
                                                    <button className="vp-btn vp-update" type='submit'>Update</button>
                                                    <button className="vp-btn vp-cancel" onClick={()=> handleReset(setFieldValue)}>Clear Changes</button>
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