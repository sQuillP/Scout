import mongoose from 'mongoose';



const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, 'firstName field is required']
    },
    lastName: {
        type: String,
        required:[true, 'lastName field is required']
    },
    email: {
        type:String,
        required: [true, 'email field is required'],
        unique: [true, 'email must be unique'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type:String,
        select: false,
        required: [true, 'password field is required'],
        min: [6, 'password must have at least six characters'],
    },
    profileImage: String,
});


const User = mongoose.model('User',UserSchema);


export default User;