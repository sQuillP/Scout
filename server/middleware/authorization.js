import Permission from "../schema/Permission.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import status from "../utility/status.js";
import Invitation from "../schema/Invite.js";
import { validateCreateInviteSchema, acceptInviteSchema } from "../controllers/validators/Invite.js";
import { updateProjectSchema, deleteProjectMemberSchema } from "../controllers/validators/ProjectValidators.js";
import {createTicketSchema} from '../controllers/validators/Ticket.js';
import User from "../schema/User.js";
import Project from "../schema/Project.js";
import bcrypt from 'bcrypt';
import { validateUpdatePassword, validateUpdateUserDetails } from "../controllers/validators/User.js";
import { validateDeleteNotification as validateDeleteNotif } from "../controllers/validators/Notification.js";
import Notification from "../schema/Notification.js";


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
            return next();
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
                        "Middleware Project does not exist"
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



/**
 * @description validate creation of ticket middleware
 */
export function validateCreateTicket(){

    return async (req,res,next)=> {
        try {
            let validBody = await createTicketSchema.isValid(req.body);
            const project = await Project.findById(req.params.projectId);
            if(validBody === false || project === null || project._id.toString() !== req.body.project){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                )
            }

            if(project.members.includes(req.body.assignedTo) === false){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "User " + req.body.assignedTo + " does not belong to project"
                    )
                );
            }

        } catch(error){
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Backend error. Pls contact dev team =("
                )
            );
        } finally {
            return next();
        }
    }
}


/**
 * @description update the project details, whatever the user wants.
 */
export function validateUpdateProject(){
    return async (req,res,next)=> {

        const expectedBodyKeys = ['title','description','members'];

        try {

            //Make sure the API key is not changed.
            delete req.body.APIKey;

            if( (await updateProjectSchema.isValid(req.body)) === false ){
                return next(
                    new ErrorResponse(
                        "Invalid Request Body",
                        status.BAD_REQUEST
                    )
                );
            }

            //if updating project has some random key
            Object.keys(req.body).forEach(key=> {
                if(expectedBodyKeys.includes(key) === false){
                    return next(
                        new ErrorResponse(
                            status.BAD_REQUEST,
                            "invalid request body"
                        )
                    );
                }
            });

            
        } catch(error) {
            return next(
                new ErrorResponse(
                    "Backend error, please contact dev team",
                    status.INTERNAL_SERVER_ERROR
                )
            );
        } finally{
            return next();
        }
    }
}



/**
 * @description - validate request body, then make sure that each member to be deleted belongs to the project.
 * @returns next() middleware function.
 */
export function validateDeleteMember(){
    return async (req,res,next)=> {
        try {
            if((await deleteProjectMemberSchema.isValid(req.body)) === false){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }

            
            const project = await Project.findById(req.params.projectId);

            
            const formattedMembers = project.members.map(member => member._id.toString());
            const projectMembers = new Set([...formattedMembers]);

            //make sure membership exists in the project.
            for(const member of req.body.members){
                if(projectMembers.has(member) === false){
                    return next(
                        new ErrorResponse(
                            status.NOT_FOUND,
                            "User " + member + " does not exist"
                        )
                    );
                }
            }
        } catch(error){
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "backend error, please contact dev team"
                )
            );
        } finally {
            return next();
        }
    }
}


/**
 * @description - make sure the updated password is not equal to the current password
 * also make sure that there are only two items in the request object.
 * 
 */
export function validateUpdateUserPassword() {
    return async (req,res,next)=> {
        try {
            if(validateUpdatePassword.isValidSync(req.body) === false || Object.keys(req.body).length !== 2){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }

            const fetchedUser = await User.findById(req.user._id)
            .select('+password');

            const isValidPassword = await bcrypt.compare(req.body.password, fetchedUser.password);
            if(isValidPassword === false) {
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid password"
                    )
                );
            }
        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Internal server error validating request body"
                )
            );
        } finally {
            return next();
        }
    }
}


/**
 * @description - validates types for request body and makes sure
 * user does not send unnecessary request object values.
 * @returns 
 */
export function validateUpdateUser() {
    return async (req,res,next)=> {
        const expectedKeys = ['firstName','lastName','email','profileImage'];
        try {
            if(validateUpdateUserDetails.isValidSync(req.body) === false){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                )
            }

            Object.keys(req.body).forEach((key)=> {
                if(expectedKeys.includes(key) === false) {
                    return next(
                        new ErrorResponse(
                            status.BAD_REQUEST,
                            "Unexpected key/value pair in request body"
                        )
                    );
                }
            });
        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Server error for updating user middleware"
                )
            );
        } finally {
            return next();
        }
    }
}



/**
 * @description - makes sure a user is the owner of a project before they 
 * can delete it.
 */
export function validateDeleteProject() {
    return async (req,res,next)=> {

        try {
            const fetchedProject = await Project.findById(req.params.projectId);
            if(fetchedProject === null) {
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Project does not exist"
                    )
                )
            }

            if(fetchedProject.creator.toString() !== req.user._id) {
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "Must be owner of the project in order to delete"
                    )
                )
            }
        } catch(error) {
            console.log(error.message);
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Internal server error in delete project middleware"
                )
            );
        } finally {
            return next();
        }
    }
}


/**
 * @description - Return error if there is no API key or API key is missing.
 */
export function validateSubmitError() {
    return async (req,res,next)=> {
        try {

            if(req.body.description === undefined || typeof req.body.description !== 'string'){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                )
            }

            if(req.headers.apikey === undefined){
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "API key missing"
                    )
                );
            }
            const fetchedProject = await Project.findOne({APIKey: req.headers.apikey});
            if(fetchedProject === null) {
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "invalid API key"
                    )
                );
            }
        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Internal server error. Contact dev team if possible"
                )
            );
        } finally {
            return next();
        }
    }
}




/**
 * @description - validate request body, make sure notification belongs to user.
 * make sure that the user belongs to the project as well.
 */
export function validateDeleteNotification() {
    return async (req,res,next)=> {
        try {
            if(validateDeleteNotif.isValidSync(req.body) === false) {
                return next(
                    new ErrorResponse(
                        status.BAD_REQUEST,
                        "Invalid request body"
                    )
                );
            }

            const fetchedNotification = await Notification.exists({
                _id: req.body.notification
            });
            //check if user belongs to project
            const fetchedPermission = await Permission.find({
                project: req.params.projectId,
                user: req.user._id,
            });

            if(fetchedPermission === null) {
                return next(
                    new ErrorResponse(
                        status.UNAUTHORIZED,
                        "You do not belong to this project"
                    )
                );
            }

            if(fetchedNotification  === null){
                return next(
                    new ErrorResponse(
                        status.NOT_FOUND,
                        "Notification does not exist"
                    )
                );
            }
            
        } catch(error) {
            return next(
                new ErrorResponse(
                    status.INTERNAL_SERVER_ERROR,
                    "Internal Server Error"
                )
            );
        } finally {
            return next();
        }
    }
}