import * as yup from 'yup';
import mongoose from 'mongoose';

/* Test some random crap for debugging purposes. */


/* Validate incoming PUT body for updating a ticket. */
// const updateTicketSchema = yup.object().shape({
//     assignedTo: yup.string().optional().test("validObjectID","Invalid objectId",function(value) {
//         console.log(value);
//         if(value === undefined) return true;
//         return mongoose.Types.ObjectId.isValid(value);
//     }).optional(),
//     priority: yup.string().oneOf(['low','medium','high']).optional(),
//     progress: yup.string().oneOf(['open','in_progress','closed']).optional(),
//     ticketType: yup.string().oneOf(['bug','crash','task','change']).optional(),
//     description: yup.string(),
//     summary: yup.string().optional()
// });


// const testObj = {
//     description:{obj:'obj'},
// };


// const valid = updateTicketSchema.isValidSync(testObj);

// console.log(valid);