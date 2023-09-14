import { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';

import {useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Scout from '../../axios/scout';
import { loginFromStoredToken, updateUserSync } from '../../redux/slice/authSlice';
import * as yup from 'yup';

import "./styles/Login.css";
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

const LoginSchema = yup.object().shape({
    email: yup.string().email().required("Please provide a valid email"),
    password: yup.string().required("Password is required.")
});

const initialFields = {
    email:"",
    password:"",
};



export default function Login() {


    const [viewPassword,updateViewPassword] = useState(false);

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const dispatch = useDispatch();


    async function onLogin(values) {
        try {
            const response = await Scout.post('/auth/login',values);
            localStorage.setItem('token',response.data.token);
            dispatch(loginFromStoredToken());//store token in redux
            const response2 = await Scout.get('/users/myDetails');
            dispatch(updateUserSync(response2.data.data));
            navigate('/projects');
        } catch(error) {
            console.log('error has occurred',error.message);
            console.log(error);
            if(error?.response?.status === 404){
                setLoginError('User not found');
            }
            else if(error?.response?.status === 401){
                setLoginError("Invalid login credentials");
            }
        }
    }


    return (
        <Formik
            initialValues={initialFields}
            validationSchema={LoginSchema}
            validateOnMount
            onSubmit={onLogin}
        >
            {(formik)=> {
                const {errors, touched, isValid, dirty, handleChange, values, handleBlur} = formik;
                return(
                    <>
                    <p>welcome</p>
                    <div className="login-content">
                        <p className="text login-title">Scout Sign In</p>
                        <Form>
                            <div className="field">
                                <label htmlFor="email">Email <span className='required'>*</span></label>
                                <i className="auth-field-icon fa-solid fa-arrow-right-to-bracket"></i>
                                <input 
                                    placeholder='bob@example.com'
                                    autoComplete='off'
                                    type="text" 
                                    className='auth-field'
                                    name='email'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                            </div>
                            {errors.email && touched.email && <p className='auth-error required text'>{errors.email}</p>}
                            <div className="field">
                                <label htmlFor="password">Password <span className='required'>*</span></label>
                                <i className="auth-field-icon fa-solid fa-lock"></i>
                                <input 
                                    autoComplete='off'
                                    type='password' 
                                    name='password' 
                                    value={values.password} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className='auth-field'
                                />
                            </div>
                            {errors.password && touched.password && <p className='auth-error required text'>{errors.password}</p>}
                            <div className='submit-container'>
                                {loginError !== '' && <p className='auth-error required text'>{loginError}</p>}
                                <Link className='auth-redirect' to='/auth/signup'>Not a user yet? Click here to sign up!</Link>
                                <button 
                                    className={'submit-btn '+ (!!Object.keys(errors).length?'disabled':'')} 
                                    type='submit'
                                    disabled={!!Object.keys(errors).length}
                                >Login</button>
                            </div>
                        </Form>
                    </div>
                    </>
                );
            }}
        </Formik>
    );
}