import mongoose from 'mongoose';
import Ticket from './Ticket.js'
import Permission from './Permission.js';
import Invitation from './Invite.js';
import TicketComment from './TicketComment.js';
import Notification from './Notification.js';


const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: [40,'Title has maximum of 40 characters.']
    },
    description: {
        type: String, 
        required: true,
        maxLength: [1000, 'Description cannot exceed 5000 characters']
    },
    members: {
       type: [{type: mongoose.Schema.ObjectId, ref:'User'}],
       validate: {
            //prevent any duplicate ids from getting into the db.
            validator: function(arr){
                let uniqueIds = new Set();
                for(let objectId of arr){
                    if(uniqueIds.has(objectId.toString()) === false)
                        uniqueIds.add(objectId.toString());
                    else
                        return false;
                }
                return true;
            },
            message:"Each user must be unique in the project"
        }
    }, 
    creator: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
    },
    APIKey: {
        type: String,
        required: true
    }
});




/* Cascade delete all tickets associated with the project. */
ProjectSchema.pre('remove',async function(next) {
    await Ticket.deleteMany({project: this._id});
    await Permission.deleteMany({project: this._id});
    next();
});


/**
 * Cascade delete all project db resources
 */
ProjectSchema.pre('findOneAndDelete', async function(next) {
    await Ticket.deleteMany({project: this._conditions._id});
    await Permission.deleteMany({project: this._conditions._id});
    await Invitation.deleteMany({project: this._conditions._id});
    await TicketComment.deleteMany({project: this._conditions._id})
    await Notification.deleteMany({project: this._conditions._id});
    next();
})

const Project = mongoose.model("Project",ProjectSchema);

export default Project;