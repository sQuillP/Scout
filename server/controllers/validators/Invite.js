import * as Yup from 'yup';
import mongoose from 'mongoose'




export const validateCreateInviteSchema = Yup.object().shape({
    project: Yup.string().test("ValidateObjectId","test invalid objectId",validateId),
    user: Yup.string().test("ValidateObjectId","test invalid objectId", validateId)
});


function validateId(value) {
    return mongoose.Types.ObjectId.isValid(value);
}


export const acceptInviteSchema = Yup.object().shape({
    invitation: Yup.string().test("validateObjectId","test invalid objectId", validateId)
});