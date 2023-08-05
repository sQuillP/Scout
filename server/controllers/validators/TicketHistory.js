import * as Yup from 'yup';
import mongoose from 'mongoose';


//validates request body
export const createTicketHistorySchema = Yup.object().shape({
    ticket: Yup.string().required().test('validateObjectId',"Invalid ObjectID",isValidObjectId),
    description: Yup.string().required(),
});


//helper
function isValidObjectId(value){
    return mongoose.Types.ObjectId.isValid(value);
}