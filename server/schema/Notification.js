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
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: false,
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project must be associated with a project"]
    },
    individualReceiver:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;