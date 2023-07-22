import Project from "../schema/Project.js";
import asyncHandler from "../utility/asyncHandler.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import User from '../schema/User.js';
import crypto from 'crypto';
import Permission from "../schema/Permission.js";
import mongoose from 'mongoose';
import Ticket from "../schema/Ticket.js";


import {
    validateCreateProjectBody
} from './validators/ProjectValidators.js'

/**
 * @description - get all projects, used for development purposes
 * @method GET /projects
 * @access authentication required
 */
export const getProjects = asyncHandler( async (req,res,next)=> {

    const projects = await Project.find();
    res.status(status.OK).json({
        data: projects
    })

});


/**
 * @description - get all projects associated with a user.
 * @returns {{
 *  data: {
 *  ...ProjectSchema,
 *  openTickets: number,
 *  closedTickets: number,
 * }
 * }}
 * @method GET /projects/myProjects
 * @access authentication
 */
export const getMyProjects = asyncHandler( async (req,res,next)=> {

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;


    //query the project objects
    const myProjects = await Project.find({members: req.user._id})
    .populate('members')
    .skip((page-1)*limit)
    .limit(limit)
    .lean();

   
    //find the count for the open and closed tickets
    let openTickets = null;
    let bugReports = null;
    for(const project of myProjects) {
        openTickets = await Ticket.find({
            project: project._id, 
            progress:'open'
        }).countDocuments();

        bugReports = await Ticket.find({
            project: project._id,
            ticketType: 'bug',
        }).countDocuments();

        //apply those queries to each project.
        project['openTickets'] = openTickets;
        project['bugReports'] = bugReports;

    }


    res.status(status.OK).json({
        data: myProjects,
        itemCount: myProjects.length,
        page:page,
        limit: limit,
    });
});




/**
 * @description Get a specific project for a user.
 * @method GET /projects/myProjects/:projectId
 * @access authenticated, developer+
 */
export const getProjectById = asyncHandler(async (req,res,next)=> {

    const retrievedProject = await Project.find({
        members: req.user._id, 
        _id: req.params.projectId
    });

    res.status(status.OK).json({
        data: retrievedProject
    });
})



/**
 * @description - Create a new project instance.
 * @method POST
 * @access authentication required
 */
export const createProject = asyncHandler( async (req,res,next)=> {

    const [validBody, errorMessage] = await validateCreateProjectBody(req);

    if(validBody === false) {
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                errorMessage
            )
        );
    }
    //new project id
    const projectId = new mongoose.Types.ObjectId();

    //create new permissions for each member
    for(const member of req.body.members) {
        await Permission.create({
            project: projectId,
            user: member._id,
            role:member.role
        });
    }

    //create admin permission for creator
    await Permission.create({
        project: projectId,
        user: req.user._id,
        role: 'administrator'
    });



    //generate an api key
    const generatedAPIKey = crypto.randomUUID();

    //get the members
    const membersArr = req.body.members.map((member)=> member._id);
    membersArr.push(req.user._id);

    //create the project
    const createdProject = await Project.create({
        title: req.body.title,
        description: req.body.description,
        members: membersArr,
        APIKey: generatedAPIKey
    });


    //return teh created project.
    res.status(status.CREATED).json({
        data: createdProject.toJSON()
    });
});




/**
 * @method PUT /api/v1/projects
 * @access authentication required
 */
export const updateProject = asyncHandler( async (req,res,next)=> {
    //make sure that user is valid
});

