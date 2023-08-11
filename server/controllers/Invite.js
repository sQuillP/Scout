import asyncHandler from "../utility/asyncHandler.js";
import Invitation from "../schema/Invite.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import { validateCreateInviteSchema, acceptInviteSchema } from "./validators/Invite.js";
import User from '../schema/User.js';
import Project from "../schema/Project.js";
import Permission from "../schema/Permission.js";
import mongoose from 'mongoose';


/**
 * @description - Get all the invites associated with a user
 * @method - GET /api/v1/invite
 * @access authenticated
 */
export const getMyInvites = asyncHandler( async (req,res,next)=> {

    const limit = req.query.limit || 10;
    const page = req.query.page || 1;



    const myInvites = await Invitation.find({
        user: req.user._id
    })
    .skip((page-1)*limit)
    .limit(limit);    

    const totalInvites = await Invitation.countDocuments({user:req.user._id});


    res.status(status.OK).json({
        data: myInvites,
        totalItems: totalInvites
    });

});


/**
 * @description - get all invites associated with a project
 * @method - GET /api/v1/invite/:projectId
 * @access - authenticated, developer+
 */
export const getProjectInvites = asyncHandler( async (req,res,next)=> {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const fetchedInvitations = await Invitation.find({project: req.params.projectId})
    .skip((page-1)*limit)
    .limit(limit)
    .populate('user');

    const totalItems = await Invitation.countDocuments({project: req.params.projectId});

    res.status(status.OK).json({
        data: fetchedInvitations,
        totalItems
    });
});



/**
 * @description - Send an invite to a user
 * @method - POST /api/v1/invite
 * @access - authenticated, developer+
 */
export const inviteUser = asyncHandler( async (req,res,next)=> {
    //body = {project:projectId, user: userId}

    if((await validateCreateInviteSchema.isValid(req.body)) === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
            )
        );
    }

    if((await Permission.exists({project: req.body.projectId,user: req.body.user})) !== null){
        return next( 
            new ErrorResponse(
                status.BAD_REQUEST,
                "User " + req.body.user + " "+"already belongs to project"
            )
        );
    }


    if((await User.exists({_id: req.body.user})) === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "User "+req.body.user + " does not exist."
            )
        );
    }

    const exists = await Invitation.exists(req.body);
    console.log(exists);
    if((await Invitation.exists(req.body)) !== null){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invitation has already been sent."
            )
        );
    }

    console.log(req.body);

    const createdInvitation = await Invitation.create(req.body);


    res.status(status.CREATED).json({
        data: createdInvitation
    });
});




/**
 * @description - person accepts invitation to join a group.
 * @method - POST /api/v1/invititation/:projectId/accept
 * {invitation: invitationId}
 * @access - authenticated
 */
export const acceptInvites = asyncHandler( async (req,res,next)=> {

    if((await acceptInviteSchema.isValid(req.body) === false)){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
            )
        );
    }

    const fetchedInvitation = await Invitation.findById(req.body.invitation);

    if(fetchedInvitation === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "User has not received any invitation to group"
            )
        );
    }

    const fetchedProject = await Project.findById(req.params.projectId)

    if(fetchedProject === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Project " +req.params.projectId +" does not exist"
            )
        );
    }

     //assign default permission to the user
     await Permission.create({
        user: req.user._id,
        project: fetchedInvitation.project,
        role:'developer'
    });

    //add member to project
    fetchedProject.members.push(req.user._id);

    await fetchedProject.save();

    //delete the created invitation as user has been added to project
    await fetchedInvitation.deleteOne();

    res.status(status.OK).json({
        data: fetchedProject
    });
});






/**
 * @description - remove an invitation from a user, send updated list of invitations to requestor.
 * @method POST - /api/v1/invite
 * @access - authenticated, project_manager+
 */
export const deleteInvitation = asyncHandler( async (req,res,next)=> {
    const fetchedInvitation = await Invitation.findById(req.body.invitation);

    if(mongoose.Types.ObjectId.isValid(req.body.invitation) === false || fetchedInvitation === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Invitation " + req.body.invitation + " does not exist"
            )
        );
    }


    await fetchedInvitation.deleteOne();

    //find all invitations associated with a project
    const fetchedInvites = await Invitation.find({project: req.body.projectId})
    .limit(5);

    

    res.status(status.OK).json({
        data:fetchedInvites
    });


});