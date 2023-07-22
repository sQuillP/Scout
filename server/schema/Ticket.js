import mongoose from 'mongoose';
import TicketHistory from './TicketHistory.js';

const TicketSchema = new mongoose.Schema({
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'ticket needs to be assigned to someone']
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'project is a required field for ticket']
    },
    priority: {
        type: String,
        required: [true, 'priority is a required field'],
        enum: ['low', 'medium', 'high']
    },
    progress: {
        type:String,
        enum: ['open','in_progress','closed'],
        required:[true,'ticket type is required']
    },
    ticketType: {
        type:String,
        required: [true, 'ticketType is a required field'],
        enum: ['bug', 'crash','task','change'],
    },
    description: {
        type: String,
        required: [true,'description is a required field'],
     },
     summary: {
        type: String,
        required: [true, 'summary is a required field']
     }
},{
    timestamps: true,
});


TicketSchema.pre('remove', async function(next) {
    //Delete any ticket history associated with the ticket to be removed.
    await TicketHistory.deleteMany({
        ticket: this._id
    });
});


const Ticket = mongoose.model('Ticket',TicketSchema);

export default Ticket;