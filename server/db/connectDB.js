import mongoose from 'mongoose';




export default async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_PROD_CONN_STRING);
        console.log('connected to database!')
    } catch(error) {
        console.log('Unable to connect to the database, quitting program');
        console.log(error.message);
        process.exit(1);
    }
}