import * as Yup from 'yup';

/**
 * @description - validate the incoming user request
 */
export const validateSignupBody = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    profileImage: Yup.string(),
});



/**
 * @description - validate incoming user request
 */
export const validateLoginBody = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
});