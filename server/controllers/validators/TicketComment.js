import * as Yup from 'yup';
import mongoose from 'mongoose';


/**
 * Author is implied
 * Ticket is implied
 */
export const createTicketCommentSchema = Yup.object().shape({
    content: Yup.string().required()
});