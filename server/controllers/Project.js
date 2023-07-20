import Project from "../schema/Project.js";
import asyncHandler from "../utility/asyncHandler.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import User from '../schema/User.js';
import crypto from 'crypto';
import Permission from "../schema/Permission.js";
import mongoose from 'mongoose';

import {
    validateCreateProjectBody
} from './validators/ProjectValidators.js'

/**
 * @description - get all projects
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
 * @method GET /projects/myProjects
 * @access authentication
 */
export const getMyProjects = asyncHandler( async (req,res,next)=> {

    const myProjects = await Project.find({members: req.user._id});

    res.status(status.OK).json({
        data: myProjects
    });
});




/**
 * @method GET /projects/:projectId
 * @access authenticated, developer+
 */
export const getProjectById = asyncHandler((req,res,next)=> {

})



/**
 * @description - Create a new project instance. Note that the user is implicitly stored
 * in the members request.
 * @method POST
 * @access authentication required
 */
export const createProject = asyncHandler( async (req,res,next)=> {
    if(validateCreateProjectBody(req) === false) {
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request format"
            )
        );
    }
    //new project id
    const projectId = new mongoose.Types.ObjectId();

    //create and populate members array
    const membersArr = [];
    
    //create new permissions for each member
    for(const member of req.body.members) {
        membersArr.push(member._id);
        await Permission.create({
            project: projectId,
            user: member._id,
            role: member.role
        });
    }
    membersArr.push(req.user._id); //user is created
    //create admin permission for creator
    await Permission.create({
        project: projectId,
        user: req.user._id,
        role: 'administrator'
    });

    //generate an api key
    const generatedAPIKey = crypto.randomUUID();

    //create the project
    const createdProject = await Project.create({
        title: req.body.title,
        description: req.body.description,
        members: membersArr,
        APIKey: generatedAPIKey
    });


    //return teh created project.
    res.status(status.OK).json({
        data: createdProject.toJSON()
    });
});




/**
 * @method PUT
 * @access authentication required
 */
export const updateProject = asyncHandler( async (req,res,next)=> {


});

