import User from "./schema/User.js";
import connectDB from './db/connectDB.js'
import fs from 'fs';
import Project from "./schema/Project.js";
import Permission from "./schema/Permission.js";
import mongoose from 'mongoose';
import crypto from 'crypto';
import Ticket from "./schema/Ticket.js";
import TicketComment from './schema/TicketComment.js';
import TicketHistory from './schema/TicketHistory.js';


/**
 * Populate the database with dummy data for development purposes
 */


function readFile(path) {
    const rawData = fs.readFileSync(path);
    return JSON.parse(rawData);
}


/**
 * @description - Reads user data from json file and inserts them into database.
 * It also creates their objectIds before insertion so they can be added throughout the app
 * 
 * @returns {Promise<ObjectId[]>}
 */
async function seedUsers() {
    const objectIds = [];
    try {
        const userData = readFile('./seed/Users.json');
        //populate array of object ids
        for(let i = 0; i<userData.length; i++) {
            objectIds.push(new mongoose.Types.ObjectId());
            userData[i]['_id'] = objectIds[i];
        }
        await User.insertMany(userData);

    } catch(error) {
        console.log('unable to seed users in db:', error.message);
    } finally {
        return objectIds;
    }
}


/**
 * @description - takes in array of ObjectIds, creates permissions for each user in the 
 * project, creates the projects for the users. Permissions are implicitly created when calling
 * seedProjects.
 * @param {ObjectId[]} uids 
 * @returns {Promise<ObjectId[]>} - Array of all projects that were created
 */
async function seedProjects(uids) {
    const NUM_PROJECTS = 12;
    const NUM_USERS = 3;
    const projectIds = [];
    //create 12 projects with three members each
    for(let i = 0; i<NUM_PROJECTS; i++){
        const projectId = new mongoose.Types.ObjectId();
        projectIds.push(projectId);
        const projectUsers = [];
        for(let j = 0; j<NUM_USERS; j++){//populate
            projectUsers.push(
                uids[j]
            );
        }

        //make rest of people devs
        for(let j = 0; j<NUM_USERS-1; j++) {
            await Permission.create({
                user: projectUsers[j],
                project:projectId,
                role: "developer"
            })
        }
        //make last guy admin
        await Permission.create({
            user: projectUsers[NUM_USERS-1],
            role:'administrator',
            project:projectId
        });

        await Project.create({
            title:'Project title '+(i+1),
            description:'project description this should be long '+(i+1),
            members:projectUsers,
            _id: projectId,
            APIKey: crypto.randomUUID()
        });

    }
    return projectIds;
}




/**
 * @description - seed tickets for all project. Each project will have 20 tickets.
 * @param {ObjectId[]} projectIds - Array of existing projectids
 * @returns {Promise<ObjectId[]>} - array of ticket ids
 */
async function seedTickets(projectIds) {
    const TICKETS_PER_PROJECT = 12;
    const priorities = ['low', 'medium', 'high'];
    const progress = ['open','in_progress','closed'];
    const ticketTypes = ['bug','crash','task','change'];

    const ticketIds = [];

        //for each project
            //create 12 tickets
            //assign them to a user in the group
            //add random populated fields
        for(const projectId of projectIds) {
            const fetchedProject = await Project.findById(projectId);
            let userIdx = 0;
            for(let i = 0; i<TICKETS_PER_PROJECT; i++) {
                const _id = new mongoose.Types.ObjectId();
                await Ticket.create({
                    assignedTo: fetchedProject.members[userIdx],
                    project:projectId,
                    priority: priorities[Math.floor(Math.random()*priorities.length)],
                    progress: progress[Math.floor(Math.random()*progress.length)],
                    ticketType: ticketTypes[Math.floor(Math.random()*ticketTypes.length)],
                    description:'Just a quick description',
                    summary: 'This should be a long summar '+(i+1),
                    _id,
                });
                userIdx= (userIdx+1)%fetchedProject.members.length;
                ticketIds.push(_id);
            }
        }
        return ticketIds;
}


/**
 * @description - populates the comment documents
 * @param {ObjectId[]} projectIds - Array of existing project ids
 * @returns {Promise<void>}
 */
async function seedComments(projectIds) {
    for(const projectId of projectIds) {
        const project = await Project.findById(projectId).populate("members");
        for(const user of project.members){
            const comment = {
                author: user._id,
                ticket: project._id,
                content: 'comment from user ' + user.email
            }
            await TicketComment.create(comment);
            await TicketComment.create(comment)
        }
    }
}


/**
 * @description takes in array of tickets and adds a certain amount of ticket history items to that ticket.
 * @param {ObjectId[]} projectIds - list of ticket ids
 */
async function seedTicketHistory(projectIds) {
    const HISTORY_PER_TICKET = 5;
    for(const projectId of projectIds) {
        //find project
        const fetchedProject = await Project.findById(projectId);
        //find tickets for project
        const fetchedTickets = await Ticket.find({project: projectId});
        let userIdx = 0;
        for(const ticket of fetchedTickets) {//for each ticket
            for(let i = 0; i<HISTORY_PER_TICKET; i++){ //add 5 ticket histories per ticket.
                await TicketHistory.create({
                    ticket: ticket._id,
                    modifiedBy: fetchedProject.members[userIdx],
                    description: 'ticket history description made by user!!!'
                });
                userIdx = (userIdx+1)%fetchedProject.members.length;//cycle through the project members.
            }
        }
    }
   
}

/**
 * @description - delete all items in the database, start clean again.
 * @returns {Promise<void>} - empty promise, like life (jk).
 */
async function abortDB() {
    try {
            await User.deleteMany();
            await Project.deleteMany();
            await Permission.deleteMany();
            await Ticket.deleteMany();
            console.log('dabatase cleared');
    } catch(error) {
        console.log('unable to abort DB, please manually clear database');
        process.exit(1);
    }
}


/**
 * @description - execute the database population process with dummy values.
 * If seeding database fails, it will automatically delete everything currently in db.
 */
async function run() {
    const flag = process.argv[2].toLowerCase();
    try {
        await connectDB();
        if(flag ==='-s'){
            const userIds = await seedUsers();
            const projectIds = await seedProjects(userIds);
            await seedTickets(projectIds);
            await seedComments(projectIds);
            await seedTicketHistory(projectIds);
            console.log('seed successful');
        }
        else if(flag === '-d') 
            await abortDB();
    }
    catch(error) {
        console.log('error happended when running: ',error.message,'aborting db...');
        await abortDB();//clean db if seeding fails.
    }
    finally {
        process.exit(0);
    }
}


run();







// seedUsers();