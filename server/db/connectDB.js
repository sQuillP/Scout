import mongoose from 'mongoose';






import mongoose from 'mongoose';



export default async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Scout');
        console.log('connected to database!')
    } catch(error) {
        console.log('Unable to connect to the database, quitting program');
        console.log(error.message);
        process.exit(1);
    }
}