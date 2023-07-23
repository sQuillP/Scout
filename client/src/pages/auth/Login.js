import { useState } from 'react';
import { Formik, Form } from 'formik';

import {useDispatch } from 'react-redux';
import { login } from '../../redux/thunk/auth';
import * as yup from 'yup';

import "./styles/Login.css";
import { Link } from 'react-router-dom';

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
    const dispatch = useDispatch();


    function onLogin(values) {
        dispatch(login(values));
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
                    <div className="login-content">
                        <p className="login-title">Scout Sign In</p>
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
                                <Link className='auth-redirect' to='/auth/signup'>Not a user yet? Click here to sign up!</Link>
                                <button 
                                    className={'submit-btn '+ (!!Object.keys(errors).length?'disabled':'')} 
                                    type='submit'
                                    disabled={!!Object.keys(errors).length}
                                >Login</button>
                            </div>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}