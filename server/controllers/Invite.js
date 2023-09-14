import asyncHandler from "../utility/asyncHandler.js";
import Invitation from "../schema/Invite.js";
import status from "../utility/status.js";
import Project from "../schema/Project.js";
import Permission from "../schema/Permission.js";


/**
 * @description - Get all the invites associated with a user
 * @method - GET /api/v1/invite
 * @access authenticated
 */
export const getMyInvites = asyncHandler( async (req,res,next)=> {

    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;


    console.log(req.query)
    const myInvites = await Invitation.find({
        user: req.user._id
    })
    .skip((page-1)*limit)
    .limit(limit)
    .populate('project');    

    const totalInvites = await Invitation.countDocuments({user:req.user._id});


    res.status(status.OK).json({
        data: myInvites,
        totalItems: totalInvites
    });

});



/**
 * DONE
 * @description - Send an invite to a user
 * @method - POST /api/v1/invite
 * @access - authenticated, developer+
 */
export const inviteUser = asyncHandler( async (req,res,next)=> {
    //body = {project:projectId, user: userId}

    const createdInvitation = await Invitation.create(req.body);

    const fetchedInvitations = await Invitation.find({
        project: createdInvitation.project,
    })
    .limit(5)
    .populate('user');

    const totalItems = await Invitation.countDocuments({project: createdInvitation.project});

    //return all invitations related to a project
    res.status(status.CREATED).json({
        data: fetchedInvitations,
        totalItems
    });
});




/**WORKS
 * @description - person accepts invitation to join a group.
 * {invitation: projectId}
 * @access - authenticated
 */
export const acceptInvite = asyncHandler( async (req,res,next)=> {

    const fetchedInvitation = await Invitation.findById(req.body.invitation);

    const fetchedProject = await Project.findById(fetchedInvitation.project);


     //assign default permission to the user
     await Permission.create({
        user: req.user._id,
        project: fetchedInvitation.project,
        project: fetchedInvitation.project,
        role:'developer'
    });

    //add member to project
    fetchedProject.members.push(req.user._id);

    await fetchedProject.save();

    //delete the created invitation as user has been added to project
    await fetchedInvitation.deleteOne();

    const updatedInvitations = await Invitation.find({user:req.user._id})
    .populate('user')
    .limit(5);

    const totalItems = await Invitation.countDocuments({user:req.user._id});

    res.status(status.OK).json({
        data: updatedInvitations,
        totalItems
    });
});


/**
 * @description - when user declines invitation, just delete the current one that exists.
 */
export const rejectInvite = asyncHandler( async (req,res,next)=> {
    const fetchedInvitation = await Invitation.findById(req.body.invitation);
    
    await fetchedInvitation.deleteOne();

    const updatedInvitations = await Invitation.find({user:req.user._id})
    .populate('project')
    .limit(5);

    const totalItems = await Invitation.countDocuments({user:req.user._id});


    res.status(status.OK).json({
        data: updatedInvitations,
        totalItems
    });
});




/**
 * DONE
 * @description - remove an invitation from a user, send updated list of invitations to requestor.
 * @method POST - /api/v1/invite
 * @access - authenticated, project_manager+
 */
export const deleteInvitation = asyncHandler( async (req,res,next)=> {
    const fetchedInvitation = await Invitation.findById(req.body.invitation);

    await fetchedInvitation.deleteOne();

    //find all invitations associated with a project
    const fetchedInvites = await Invitation.find({
        project: fetchedInvitation.project
    })
    .limit(5)
    .populate('user');

    const invitationCount = await Invitation.countDocuments({
        project: fetchedInvitation.project
    });


    res.status(status.OK).json({
        data:fetchedInvites,
        totalItems: invitationCount
    });


});



/**
 * DONE
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