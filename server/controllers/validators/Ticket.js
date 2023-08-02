import * as yup from 'yup';


/* Validate incoming PUT body for updating a ticket. */
export const updateTicketSchema = yup.object().shape({
    assignedTo: yup.string(),
    project: yup.string().required(),
    priority: yup.string().oneOf(['low','medium','high']),
    progress: yup.string().oneOf(['open','in_progress','closed']),
    ticketType: yup.string().oneOf(['bug','crash','task','change']),
    description: yup.string(),
    summary: yup.string()
});

