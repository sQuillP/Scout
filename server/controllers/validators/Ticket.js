import * as yup from 'yup';
import mongoose from 'mongoose';

/* Validate incoming PUT body for updating a ticket. */
export const updateTicketSchema = yup.object().shape({
    assignedTo: yup.string().optional().test("validObjectID","Invalid objectId",function(value) {
        if(value === undefined) return true;
        return mongoose.Types.ObjectId.isValid(value);
    }).optional(),
    priority: yup.string().oneOf(['low','medium','high']).optional(),
    progress: yup.string().oneOf(['open','in_progress','closed']).optional(),
    ticketType: yup.string().oneOf(['bug','crash','task','change']).optional(),
    description: yup.string(),
    summary: yup.string().optional()
});


export const createTicketSchema = yup.object().shape({
    assignedTo: yup.string().test("Validate objectId", "Invalid objectId",validateObjectId).required(),
    project: yup.string().test("Validate objectId","invalid object id", validateObjectId).required(),
    priority: yup.string().oneOf(['low','medium','high']).required(),
    progress: yup.string().oneOf(['open','in_progress','closed']).required(),
    ticketType: yup.string().oneOf(['bug','crash','task','change']).required(),
    description: yup.string().required(),
    summary: yup.string().required(),
});


function validateObjectId(value){
    return mongoose.Types.ObjectId.isValid(value);
}