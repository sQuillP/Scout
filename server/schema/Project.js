import mongoose from 'mongoose';
import Ticket from './Ticket.js'

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: [20,'Title has maximum of 20 characters.']
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
                console.log(arr);
                for(let objectId of arr){
                    if(uniqueIds.has(objectId.toString()) === false)
                        uniqueIds.add(objectId.toString());
                    else
                        return false;
                }
                uniqueIds.clear();
                return true;
            },
            message:"Each user must be unique in the project"
        }
    },
    APIKey: {
        type: String,
        required: true
    }
});


/* Cascade delete all tickets associated with the project. */
ProjectSchema.pre('remove',async function(next) {
    await Ticket.deleteMany({
        project: this._id
    });
    next();
})

const Project = mongoose.model("Project",ProjectSchema);

export default Project;