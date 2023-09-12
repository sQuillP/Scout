import * as yup from 'yup';

export const userSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Please provide correct email").required("Email is required"),
    password: yup.string().min(6, "Password min of 6 characters").required("Password is required") ,//include good reg ex matching.
    profileImage: yup.string(),
});


export const initialValues = {
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    profileImage:'',
};



