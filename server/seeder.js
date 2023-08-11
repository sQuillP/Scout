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
import Invitation from "./schema/Invite.js";


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
    const userData = readFile('./seed/Users.json');
    //populate array of object ids
    for(let i = 0; i<userData.length; i++) {
        objectIds.push(new mongoose.Types.ObjectId());
        userData[i]['_id'] = objectIds[i];
    }
    await User.insertMany(userData);

    return objectIds;
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
    const COMMENTS_PER_TICKET = 10;
    //for each project
    for(const projectId of projectIds) {

        //fetch the project by id
        const fetchedProject = await Project.findById(projectId);

        //get all tickets associated with project
        const tickets = await Ticket.find({project:projectId})
        .populate('assignedTo');

        //create comments for each ticket
        //each user is part of the project as well.
        for(const ticket of tickets) {
            for(let i = 0; i<COMMENTS_PER_TICKET; i++){
                const newComment = {
                    author: fetchedProject.members[(i%fetchedProject.members.length)],
                    ticket: ticket._id,
                    content: "comment from some user. This should be a lot of text"
                }
                await TicketComment.create(newComment);
            }
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
async function dumpDB() {
    try {
            await User.deleteMany();
            await Project.deleteMany();
            await Permission.deleteMany();
            await Ticket.deleteMany();
            await Invitation.deleteMany();
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
            await dumpDB();
            const userIds = await seedUsers();
            const projectIds = await seedProjects(userIds);
            await seedTickets(projectIds);
            await seedComments(projectIds);
            await seedTicketHistory(projectIds);
            console.log('seed successful');
        }
        else if(flag === '-d') 
            await dumpDB();
    }
    catch(error) {
        console.log('error happended when running: ',error.message,'aborting db...');
        await dumpDB();//clean db if seeding fails.
    }
    finally {
        process.exit(0);
    }
}


run();







// seedUsers();