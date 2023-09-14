import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFromStoredToken, updateUserSync } from '../../redux/slice/authSlice';
import Scout from '../../axios/scout';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Snackbar,
} from '@mui/material'
import "./styles/Signup.css";
import "./styles/Shared.css";


const SignupSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Please provide correct email").required("Email is required"),
    password: yup.string().min(6, "Password min of 6 characters").required("Password is required") ,//include good reg ex matching.
    profileImage: yup.string(),
});

const initialValues = {
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    profileImage:'',
};


//Turn the initial value key into the desired string value in UI.
const valueMap = {
    firstName:{
        title: "First Name",
        icon:"fa-solid fa-user",
        placeholder:"Bob"
    },
    lastName:{
        title: 'Last Name',
        icon: 'fa-solid fa-user',
        placeholder:'Smith'
    },
    email:{
        title: "Email",
        icon:'fa-solid fa-at',
        placeholder: 'bob@example.com'
    },
    password:{
        title:"Password",
        icon:"fa-solid fa-lock",
        placeholder:''
    },
    profileImage:{
        title: 'Profile Image',
        icon: "fa-solid fa-image",
        placeholder:'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'
    }
};


export default function Signup(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);


    async function onSubmit(form) {

        try  {
            const response = await Scout.post('/auth/signup',form);
            localStorage.setItem('token',response.data.token);
            dispatch(loginFromStoredToken());

            const response2 = await Scout.get('/users/myDetails');
            dispatch(updateUserSync(response2.data.data));

            navigate('/projects');
        } catch(error) {
            console.log('unable to sign in...',error.message);
            setOpenSnackbar(true);
        }
    }

    

    function renderFields(formik, start, end) {
        const {handleChange, handleBlur, values, errors, touched } = formik;
        return Object.keys(values).map((formValue)=> {
            return (
                <div 
                    key={formValue} 
                    className="field"
                >
                    <label className='auth-label' htmlFor={formValue}>{valueMap[formValue].title} {formValue !== 'profileImage'&&<span className="required">*</span>}</label>
                    <i className={"auth-field-icon "+valueMap[formValue].icon}></i>
                    <input 
                        placeholder={valueMap[formValue].placeholder}
                        type={formValue === 'password'?"password":'text' } 
                        autoComplete='off'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[formValue]}
                        name={formValue}
                        className={`auth-field ${errors[formValue] && touched[formValue]?'invalid-auth-field':''}`}
                    />
                    {errors[formValue] && touched[formValue] && <p className='text auth-error required'>{errors[formValue]}</p> }

                </div>
            )
        }).slice(start,end);
    }



    return (
        <>
            <Snackbar
                open={openSnackbar}
                onClose={()=> setOpenSnackbar(false)}
                anchorOrigin={{horizontal:'center', vertical: 'bottom'}}
                autoHideDuration={2000}
            >
                <Alert severity='error'>Unable to sign up. Please check your connection.</Alert>
            </Snackbar>
            <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={onSubmit}
                validateOnMount
            >
            {(formik)=> {
                const {errors} = formik;
                return (
                    <div className="signup-content">
                        <p className='text signup-title'>Scout Sign Up</p>
                        <Form>
                            <div className="signup-container">
                                <div className="signup-cols">
                                    <div className="signup-col">
                                        {renderFields(formik,0,2)}
                                    </div>
                                    <div className="signup-col">
                                        {renderFields(formik, 2,4)}
                                    </div>
                                </div>
                                <div className="signup-col">
                                    {renderFields(formik,4,5)}
                                </div>
                            </div>
                            <div className="submit-container">
                                <Link to={'/auth/login'} className='auth-redirect'>Already a user? Click here to log in!</Link>
                                <button 
                                    type='submit' 
                                    className={`submit-btn ${!!Object.keys(errors).length?'disabled':''}`}
                                    disabled={!!Object.keys(errors).length}
                                    >Get Trackin'</button>
                            </div>
                        </Form>
                    </div>
                );
            }}
            </Formik>
        </>
    );
}