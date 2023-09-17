import mongoose from "mongoose";


/* Notification schema */
const NotificationSchema = new mongoose.Schema({
    notificationFor: {
        type: String,
        enum: ["comment", "ticket", "change"]
    },
    title: {
        type: String,
        required: [true, "Please provide notification title"]
    },
    description:{
        type: String,
        required: [true, "Description is necessary for notification"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: false,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project must be associated with a project"]
    },
    individualReceiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket', 
        required: [true, "notification must be associated with a ticket"]
    }
},{
    timestamps: true
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;