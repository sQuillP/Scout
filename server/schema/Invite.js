import mongoose from 'mongoose';




/**
 * Invitation schema
 */
const InviteSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: "Project",
        required: [true, "Project ID is required"]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: [true, 'must have a user invitation is sent to.']
    },
});

const Invitation = mongoose.model("Invite",InviteSchema);

export default Invitation;