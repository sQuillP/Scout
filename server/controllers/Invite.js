import asyncHandler from "../utility/asyncHandler.js";
import Invitation from "../schema/Invite.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import { validateCreateInviteSchema, acceptInviteSchema } from "./validators/Invite.js";
import User from '../schema/User.js';
import Project from "../schema/Project.js";
import Permission from "../schema/Permission.js";

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



export const inviteUser = asyncHandler( async (req,res,next)=> {

    if(await (validateCreateInviteSchema.isValid(req.body)) === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
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


    const createdInvitation = await Invitation.create(req.body,{new:true});


    res.status(status.CREATED).json({
        data: createdInvitation
    });
});


/**
 * @description - person accepts invitation to join a group.
 * {project: projectId}
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

    const fetchedInvitation = await Invitation.findOne({project: req.body.project, user: req.user._id});

    if(fetchedInvitation === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "User has not received any invitation to group"
            )
        );
    }

    const fetchedProject = await Project.findById(req.body.project);

    if(fetchedProject === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Project " + req.body.project + " does not exist"
            )
        );
    }

     //assign default permission to the user
     await Permission.create({
        user: req.user._id,
        project: req.body.project,
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