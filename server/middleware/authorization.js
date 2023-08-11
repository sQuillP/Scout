import Permission from "../schema/Permission.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import Invitation from "../schema/Invite.js";

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
 * 
 * @description - check if user belongs to project, and that they have 
 * the right permissions before deleting invite
 * 
 * @param {string[]} allowedRoles - strings of each permission that can execute 
 * operations on a resource.
 * 
 * 
 */
export function validateDeleteInvite(allowedRoles){

    return async (req,res,next)=> {

        try {
            const fetchedInvitation = await Invitation.findById(req.body.invitation);
            if(fetchedInvitation === null ){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Invitation " + req.body.invitation + " does not exist"
                    )
                );
            }
            const projectId = fetchedInvitation.project.toString();
            const fetchedPermission = await Permission.findOne({
                user: req.user._id,
                project: projectId
            });

            if(fetchedPermission === null){
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "User does not belong to project"
                    )
                );
            }
            if(allowedRoles.includes(fetchedPermission.role) === false){
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
                    "Internal server error =("
                )
            );
        } finally {
            next();
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