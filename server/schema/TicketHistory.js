import mongoose from 'mongoose';


const TicketHistorySchema = new mongoose.Schema({
    ticket:{
        type: mongoose.Schema.ObjectId,
        ref: "Ticket",
        required: [true,'please provide a ticket for ticketHistory']
    },
    modifiedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'modifiedBy is a required field for tickethistory']
    },
    description: {
        type: String,
        required: [true, 'description is a required field for ticket history'],
        max: [90,'Please leave description to a max of 90 characters in ticket history'],
    }
},{
    timestamps: true
});


const TicketHistory = mongoose.model('TicketHistory',TicketHistorySchema);

export default TicketHistory;
