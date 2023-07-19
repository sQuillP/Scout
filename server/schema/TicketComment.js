import mongoose from 'mongoose';


/**
 * NOTE: Please check if mongodb keeps track of items 
 * whether if they were last updated.
 */
const TicketCommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket'
    },
    content: {
        type: String,
        required: [true, 'please provide comment content']
    },
});

//handle ticket comment logic.


const TicketComment = mongoose.model("TicketComment",TicketCommentSchema);


export default TicketComment;