import * as Yup from 'yup';


export const validateUpdatePassword = Yup.object().shape({
    password: Yup.string().required(),
    newPassword: Yup.string().test("notEqual","Strings must not be equal",(value,context)=> {
        return value !== context.parent.password        
    })
});


export const validateUpdateUserDetails = Yup.object().shape({
    firstName: Yup.string().nonNullable(),
    lastName: Yup.string().nonNullable(),
    email: Yup.string().email().nonNullable(),
});