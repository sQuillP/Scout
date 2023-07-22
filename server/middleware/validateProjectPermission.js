import User from "../schema/User.js";
import Permission from "../schema/Permission.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";


/**
 * @description - Ensure that a user has proper permissions to do modifications on a project.
 * For modification, they must either be project_manager or administrator
 * @param {string[]} permissions - either "administrator" | "developer" | "project_manager"
 * @returns {async()=>Promise<void>}
 */
export default function validateProjectPermission(permissions){

    return async (req,res,next)=> {
        const fetchedPermission = await Permission.find({ user: req.user._id });
        if(fetchedPermission === null || fetchedPermission.role === 'developer')
            return next(
                new ErrorResponse(
                    status.FORBIDDEN,
                    "Insufficient permissions"
                )
            );
        next();
    }
}