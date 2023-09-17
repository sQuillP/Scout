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
                "Getprojectbyid Project does not exist"
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
});



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

    const mapRolesToUser = new Map();

    //create new permissions for each member
    for(const member of req.body.members) {
        const createdPermission = await Permission.create({
            project: projectId,
            user: member._id,
            role:member.role
        });
        mapRolesToUser.set(member._id, member.role);
    }

    //create admin permission for creator
    const creatorPermission = await Permission.create({
        project: projectId,
        user: req.user._id,
        role: 'administrator'
    });

    mapRolesToUser.set(req.user._id, 'administrator');


    //generate an api key
    const generatedAPIKey = crypto.randomUUID();

    //get the members
    const membersArr = req.body.members.map((member)=> member._id);
    membersArr.push(req.user._id);

    //create the project
    let createdProject = await Project.create({
        _id: projectId,
        title: req.body.title,
        description: req.body.description,
        members: membersArr,
        APIKey: generatedAPIKey,
        creator: req.user._id,
    });

    console.log(membersArr);
    createdProject = (await createdProject.populate('members')).toObject();

    console.log(mapRolesToUser)
    for(const member of createdProject.members ) {
        member['role'] = mapRolesToUser.get(member._id.toString());
        console.log(member);
    }


    const openTickets = await Ticket.find({
        progress:'open',
        project:req.params.projectId,
    }).countDocuments();

    const assignedTickets = await Ticket.find({
        assignedTo: req.user._id,
        project: req.params.projectId,
        $or:[{progress:'open'},{progress:'in_progress'}]
    }).countDocuments();

    createdProject['openTickets'] = openTickets;
    createdProject['assignedTickets'] = assignedTickets;
    createdProject['userPermission'] = creatorPermission.toObject();

    //return the created project.
    res.status(status.CREATED).json({
        data: createdProject
    });
});




/**
 * @description - NOTE this only updates the PERMISSIONS of each user.
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
 * @description - delete member and rebuild the response object.
 * @method DELETE /api/v1/projects/:projectId/members
 * @access project_manager+
 */
export const deleteMember = asyncHandler( async(req,res,next)=> {

    //find project
    const updatedProject = await Project.findById(req.params.projectId).populate('members');

    //remove the members in the request body
    req.body.members.forEach((member)=> {
        updatedProject.members.splice(
            updatedProject.members.findIndex(projectMember => projectMember._id.toString() === member),
            1
        )
    });

    //save changes and send back to user.
    await updatedProject.save();

    //remove all permissions associated with the project
    for(let i = 0; i<req.body.members.length; i++) {
        await Permission.findOneAndRemove({
            project: req.params.projectId,
            user: req.body.members[i]
        });
    }

    const response = await populateUpdatedProjectResponse(updatedProject.toJSON(), req);

    console.log(response);

    res.status(status.OK).json({
        data: response,
    });
});


/**
 * @description - refresh a project API key
 * @access - authenticated, administrator only
 * @method PUT
 */
export const refreshProjectKey = asyncHandler( async (req,res,next)=> {

    const newAPIKey = crypto.randomUUID();

    let updatedProject = await Project.findByIdAndUpdate(req.params.projectId,{APIKey: newAPIKey}, {new: true})
    .populate('members').lean();

    updatedProject = await populateUpdatedProjectResponse(updatedProject,req);

    res.status(status.OK).json({
        data: updatedProject
    })
});



/**
 * @description - Update an existing project
 * @access - authenticated, administrator only
 * @method PUT /api/v1/projects/:projectId
 */
export const updateProject = asyncHandler( async (req,res,next)=> {

    let project = await Project.findByIdAndUpdate(req.params.projectId,req.body,{new: true})
    .populate('members')
    .lean();

    project = await populateUpdatedProjectResponse(project,req);

    res.status(status.OK).json({
        data: project
    });
});




/**
 * @description - Delete an existing project
 * @access - authenticated, admininistrator only
 * @method DELETE
 */

export const deleteProject = asyncHandler( async(req,res,next)=> {


    await Project.findByIdAndDelete(req.params.projectId);

    res.status(status.OK).json({
        data: null,
        message:"Successfully deleted project"
    });
});



/**
 * @description - MUST pass in a project object and a request object with projectId in the params.
 * Members must also be populated. This can be implemented anywhere that returns a updated project instance.
 * @param {Object} project - project object from db
 * @param {Object} req - request object sent out to the user
 * @returns {Object} Project with populated role fields
 */
async function populateUpdatedProjectResponse(project,req){
    
    for(let i = 0; i<project.members.length; i++){
        const memberPermission = await Permission.findOne({
            user: project.members[i],
            project: req.params.projectId,
        });

        project.members[i]['role'] = memberPermission.role;
    }

    const fetchedPermission = await Permission.findOne({
        user: req.user._id,
        project: req.params.projectId
    }).lean();

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

    project['assignedTickets'] = assignedTickets;
    project['openTickets'] = openTickets;
    project['userPermission'] = fetchedPermission;
    return project;
}

