import mongoose from 'mongoose';


const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 20
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref:'User',
    }],
    APIKey: {
        select: false,
        type: String,
        required: true
    }
});

const Project = mongoose.model("Project",ProjectSchema);

export default Project;