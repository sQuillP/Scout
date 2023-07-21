import mongoose from 'mongoose';


const PermissionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: [true, 'please provide project for the permission']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, 'please provide user for permission'],
    },
    role: {
        type: String,
        enum:["administrator","project_manager","developer"],
        required: [true, 'please provide a role for the permission']
    }
});


const Permission = mongoose.model("Permission",PermissionSchema);


export default Permission;