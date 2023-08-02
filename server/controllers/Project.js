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
    validateCreateProjectBody, validateUpdateProjectMembers
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

    const totalProjects = await Project.find({members: req.user._id}).countDocuments();
   
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
        totalItems: totalProjects
    });
});




/**
 * @description Get a specific project for a user. Attach a permission associated with the project
 * and get the user as well
 * @method GET /projects/myProjects/:projectId
 * @access authenticated, developer+
 */
export const getProjectById = asyncHandler(async (req,res,next)=> {

    const retrievedProject = await Project.findOne({
        members: req.user._id, 
        _id: req.params.projectId
    })
    .populate('members')
    .lean();

    if(retrievedProject === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Project does not exist"
            )
        );
    }

    //get the permissions associated with each member.
    for(const member of retrievedProject.members){
        const memberPermission = await Permission.findOne({
            project: req.params.projectId,
            user: member._id
        });
        member['role'] = memberPermission.role;
    }

    let fetchedPermission = null;

    //get the users permission on that project if it exists
    fetchedPermission = await Permission.findOne({
        project: retrievedProject._id, 
        user: req.user._id
    });

    //attach permission for the the user that is making request
    retrievedProject['userPermission'] = fetchedPermission;

    //find all assigned tickets in project.
    const assignedTickets = await Ticket.find({
        assignedTo: req.user._id,
        project: req.params.projectId,
        $or:[{progress:'open'},{progress:'in_progress'}]
    }).countDocuments();

    //find all open tickets in project.
    const openTickets = await Ticket.find({
        progress:'open',
        project:req.params.projectId,
    }).countDocuments();

    retrievedProject['assignedTickets'] = assignedTickets;
    retrievedProject['openTickets'] = openTickets;

    res.status(status.OK).json({
        data: retrievedProject
    });
})



/**
 * @description - Create a new project instance.
 * @method POST /api/v1/projects
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
 * @method PUT /api/v1/projects/myProjects/:projectId/members
 * @param {{
 *  members: [{
 *  _id: string,
 *  role: string
 * }]
 * }}
 * @access authentication required
 */
export const updateProjectMembers = asyncHandler( async (req,res,next)=> {
    //make sure that user is valid

    //find the project associated with the updates
    const fetchedProject = await Project.findById(req.params.projectId)
    .populate('members')
    .lean();

    const [validBody, errorMessage] = validateUpdateProjectMembers(req,fetchedProject);
    
    if(validBody === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                errorMessage
            )
        );
    }

    const {members} = req.body;

    //build the response object and apply updates to the permissions
    for(const memberFromBody of members) {
        //fetch the permission and provide the update
        const projectMember = fetchedProject.members.find((projectMember)=> {
            return projectMember._id.toString() === memberFromBody._id;
        });
        const fetchedPermission = await Permission.findOneAndUpdate({
            user: memberFromBody._id,
            project: req.params.projectId
        },{
            role: memberFromBody.role
        });
        projectMember.role = memberFromBody.role;
    }

    //add the rest of permissions to the project
    for(const member of fetchedProject.members){
        const fetchedPermission = await Permission.findOne({
            project: req.params.projectId,
            user: member._id.toString()
        });
        member.role = fetchedPermission.role
        if(member._id.toString() === req.user._id)
            fetchedProject['userPermission'] = fetchedPermission;
    }

    //find all assigned tickets in project.
    const assignedTickets = await Ticket.find({
        assignedTo: req.user._id,
        project: req.params.projectId,
        $or:[{progress:'open'},{progress:'in_progress'}]
    }).countDocuments();

    //find all open tickets in project.
    const openTickets = await Ticket.find({
        progress:'open',
        project:req.params.projectId,
    }).countDocuments();

    fetchedProject['assignedTickets'] = assignedTickets;
    fetchedProject['openTickets'] = openTickets;

    //return fetched project instance.
    res.status(status.OK).json({
        data: fetchedProject
    });
});



/**
 * @method DELETE /api/v1/projects/:projectId/members
 * @access project_manager+
 */
export const deleteMember = asyncHandler((req,res,next)=> {

});
