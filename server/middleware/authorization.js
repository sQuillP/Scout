import Permission from "../schema/Permission.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import Invitation from "../schema/Invite.js";
import { validateCreateInviteSchema, acceptInviteSchema } from "../controllers/validators/Invite.js";
import User from "../schema/User.js";
import Project from "../schema/Project.js";

/**
 * @description - Ensure that a user has proper permissions to do modifications on a project.
 * this is used in routes/Project.js and routes/Ticket.js. Any action that falls under a project
 * can be controlled by applying the following roles in the allowedRoles array.
 * 
 * @requires /api/v1/projects/:projectId/* - handles authorization for the preceding routes
 * 
 * @param {string[]} allowedRoles - either "administrator" | "developer" | "project_manager". This is an array
 * @returns {()=>Promise<void>}
 */
export function validateProjectPermission(allowedRoles){

    return async (req,res,next)=> {
        try {
            const fetchedPermission = await Permission.findOne({ 
                user: req.user._id,
                project: req.params.projectId
            });
            //check to see if user belongs to project and their role suffices
            if(fetchedPermission === null || allowedRoles.includes(fetchedPermission.role) === false){
                return next(
                    new ErrorResponse(
                        status.FORBIDDEN,
                        "Insufficient permissions: Project does not belong to user"
                    )
                );
            }
        } catch(error) {
            console.log(error.message)
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Middleware permission error. Contact dev team if issue persists"
                )
            )
        } finally{
            next();
        }
    }
}



/**
 * @description - check if user belongs to project, and that they have 
 * the right permissions before deleting invite
 * @param {string[]} allowedRoles - strings of each permission that can execute 
 * operations on a resource.
 */
export function validateDeleteInvite(allowedRoles){

    return async (req,res,next)=> {
        try {

            console.log(req.body);

            if((await acceptInviteSchema.isValid(req.body)) === false){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }


            const fetchedInvite = await Invitation.findById(req.body.invitation);

            if(fetchedInvite === null) {
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Invite " + req.body.invitation + " does not exist"
                    )
                );
            }

            const fetchedPermission = await Permission.findOne({
                user: req.user._id,
                project: fetchedInvite.project
            });

            if(fetchedPermission === null){
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "Permission not found"
                    )
                );
            }

            if(allowedRoles.includes(fetchedPermission.role) === false){
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "Insufficient permissions"
                    )
                );
            }

        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Internal server error =("
                )
            );
        } finally {
            return next();
        }
    }
}


/**
 * @param {string[]} roles 
 * @description - prevents bad requests from creating an invite object.
 * This ensures that request body is valid, and proper permissions as well as
 * other db objects exist before invite is sent.
 */
export function validateCreateInvite(roles){
    return async (req,res,next)=> {

        try {

            //valid request body
            if((await validateCreateInviteSchema.isValid(req.body)) === false){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }
        
            //ensure user exists
            if((await User.exists({_id: req.body.user})) === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "User "+req.body.user + " does not exist."
                    )
                );
            }
        
            const project = await Project.findById(req.body.project);
            //ensure project exists.
            if(project === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Project does not exist"
                    )
                );
            }

            const isMember = project.members.includes(req.user._id);
            
            //ensure inviter belongs to project
            if(isMember === false){
                return next(
                    new ErrorResponse(
                        status.FORBIDDEN,
                        "You do not belong to project " + req.body.project
                    )
                );
            }

            //ensure that person that is invited belongs to the group already
            if(project.members.includes(req.body.user) === true) {
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "User " + req.body.user + " already belongs to the group"
                    )
                );
            }

            const fetchedPermission = await Permission.findOne({
                user: req.user._id,
                project: req.body.project
            });

            //ensure user has correct permission.
            if(fetchedPermission === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Permission does not exist"
                    )
                );
            }

            //make sure they have the right roles for inviting others.
            if(roles.includes(fetchedPermission.role) === false){
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "Insufficient permissions to invite user."
                    )
                );
            }

            //make sure invitation has not already been sent.
            if(( await Invitation.exists(req.body)) !== null){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invite has already been sent."
                    )
                );
            }

    } catch(error){
        return next(
            new ErrorResponse(
                status.INTERNAL_SERVER_ERROR,
                "Internal server error in middleware. Contact dev team if issue persists."
            )
        );
    } finally {
        return next();
    }
    }
}



/**
 * @description middleware for when a user rejects or accepts an invitation.
 * {invitation: objectId}
 * @returns 
 */
export function validateAcceptOrRejectInvite(){

    return async (req,res,next)=> {
        try{
            if((await acceptInviteSchema.isValid(req.body) === false)){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }
        
            const fetchedInvitation = await Invitation.findOne({
                _id: req.body.invitation,
                user: req.user._id
            });
        
            if(fetchedInvitation === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "User has not received any invitation to group"
                    )
                );
            }
        } catch(error){
            return next(
                status.INTERNAL_SERVER_ERROR,
                "Internal server error in middleware. Contact dev team if issue persists."
            )
        } finally{
            return next();
        }
    }
}


/**
 * @description - check if user belongs to group and has adequate permissions.
 * @param {string[]} roles 
 * @returns {()=> Promise<void>}
 */
export function validateInvite(roles) {


    return async (req,res,next)=> {
        try {
            const fetchedPermission = await Permission.findOne({
                project: req.body.projectId,
                user: req.user._id
            });

            if(fetchedPermission === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "User does not belong to project"
                    )
                )
            }

            if(roles.includes(fetchedPermission.role) === false){
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "Not authorized"
                    )
                );
            }
        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Backend error. Contact dev team if issue persists."
                )
            );
        } finally{
            next();
        }
        
    }
}