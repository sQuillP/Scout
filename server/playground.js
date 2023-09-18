import * as Yup from 'yup';
import mongoose from 'mongoose';
import connectDB from './db/connectDB.js';

/* Test some random crap for debugging purposes. */


const validateUpdatePassword = Yup.object().shape({
    password: Yup.string().required(),
    newPassword: Yup.string().test('notEqual','must not be equal strings',(value, testContext)=> {
        return value !== testContext.parent.password
    })
});


