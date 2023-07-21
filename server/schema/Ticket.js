import mongoose from 'mongoose';


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
});



const Ticket = mongoose.model('Ticket',TicketSchema);

export default Ticket;