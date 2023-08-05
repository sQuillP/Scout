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

