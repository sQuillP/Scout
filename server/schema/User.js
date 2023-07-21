import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


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
        minLength: [6, 'password must have at least six characters'],
    },
    profileImage: String,
});


/* Used for development purposes */
UserSchema.pre('insertMany', async function(next,docs) {
    if(!Array.isArray(docs) && docs.length === 0) return;
    try {
        for(let i = 0; i<docs.length; i++){
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(docs[i].password, salt);
            docs[i].password = passwordHash;
        }
    } catch(error) {
        console.log(error.message);
    } finally {
        next();
    }
});

const User = mongoose.model('User',UserSchema);


export default User;