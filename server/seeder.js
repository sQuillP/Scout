import User from "./schema/User.js";
import connectDB from './db/connectDB.js'
import fs from 'fs';
import Project from "./schema/Project.js";
import Permission from "./schema/Permission.js";


function readFile(path) {
    const rawData = fs.readFileSync(path);
    return JSON.parse(rawData);
}



async function seedUsers() {
    try {
        const userData = readFile('./seed/Users.json');
        await User.insertMany(userData);
    } catch(error) {
        console.log('unable to seed users in db:', error.message);
        process.exit(1);
    }
}


//add more async functions

async function run() {
    const flag = process.argv[2].toLowerCase();
    try {
        await connectDB();
        if(flag ==='-s'){
            await seedUsers();

            console.log('seed successful');
        }
        else if(flag === '-d') {
            await User.deleteMany();
            await Project.deleteMany();
            await Permission.deleteMany();
            console.log('dabatase cleared');
        }
    }
    catch(error) {
        console.log('error happended when running: ',error.message);
    }
    finally {
        process.exit(0);
    }
}


run();







// seedUsers();