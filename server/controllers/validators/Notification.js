import * as Yup from 'yup';


export const validateDeleteNotification = Yup.object().shape({
    notification: Yup.string().required()
});
