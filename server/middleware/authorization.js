import User from "../schema/User.js";
import Permission from "../schema/Permission.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";


/**
 * @description - Ensure that a user has proper permissions to do modifications on a project.
 * this is used in routes/Project.js and routes/Ticket.js. Any action that falls under a project
 * can be controlled by applying the following roles in the allowedRoles array.
 * 
 * @requires /api/v1/projects/:projectId/* - handles authorization for the preceding routes
 * 
 * @param {string[]} allowedRoles - either "administrator" | "developer" | "project_manager". This is an array
 * @returns {async()=>Promise<void>}
 */
export function validateProjectPermission(allowedRoles){

    return async (req,res,next)=> {
        const fetchedPermission = await Permission.findOne({ 
            user: req.user._id,
            project: req.params.projectId
         });

        //check to see if user belongs to project and their role suffices
        if(fetchedPermission === null || allowedRoles.includes(fetchedPermission.role) === false)
            return next(
                new ErrorResponse(
                    status.FORBIDDEN,
                    "Insufficient permissions: Project does not belong to user"
                )
            );
        next();
    }
}