import * as Yup from 'yup';
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

/* Validate Update to a project */
export const updateProjectSchema = Yup.object().shape({
    title: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    members: Yup.array().test('is-string-array','please use array of strings',(value)=> {
        if(!value || value.length === 0) return true;
        return Array.isArray(value) && value.every((v)=> typeof v === 'string')
    }).notRequired(),
    APIKey: Yup.string().notRequired(),
});

const test = {
    members: ['some value','value']
};

const isvalid = updateProjectSchema.isValidSync(test);


console.log(isvalid);