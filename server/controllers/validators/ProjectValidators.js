import User from "../../schema/User.js";
import status from "../../utility/status.js";
import mongoose from "mongoose";
import * as Yup from 'yup';

/**
 * 
 * @param { {
 *  title: string,
 *  description:string,
 *  members: [{
 *      _id: ObjectId,
 *      role: string
 * }]
 * {}} }RequestObject}  req 
 * @param {()=> null} next - calls the next middleware function
 * @returns {[isValid:boolean, message:string]}
 */
export async function validateCreateProjectBody(req) {
    const projectFormat = ['title','description'];
    const memberRoles = ["administrator","project_manager","developer"];
    //verify that there are three fields in total
    if(Object.keys(req.body).length !== 3)
        return [false, "Project should have only three fields"];

    //validate the project object title and description are strings
    projectFormat.forEach((key)=> {
        if(typeof req.body[key] !== 'string')
            return [false,'invalid project format'];
    });

    //check if members is an array
    if(Array.isArray(req.body.members) === false){
        return [false, 'not an array'];
    }

    //validate the member object array
    for(let i = 0; i< req.body.members.length; i++){
        let member = req.body.members[i];
        if(Object.keys(member).length !== 2)//ensure exactly two fields in the member object.
            return [false,'member should have exactly two fields'];

        if(typeof member._id !== 'string' || 
            typeof member.role !== 'string' ||
            memberRoles.includes(member.role) === false
        ){
            return [false, 'invalid member field names or types'];
        }

        //remove user object if owner specifies themselves
        if(member._id === req.user._id)
            req.body.members.splice(i,1);
    }

    //ensure that these members exist in the first place
    //avoid duplicate members in the request body
    const visitedUsers = new Set();
    for(const member of req.body.members) {
        const exists = await User.findById(member._id);
        if(exists === null)
            return [false,'user does not exist'];

        if(visitedUsers.has(member._id))
            return [false, 'Cannot have duplicate members']
        visitedUsers.add(member._id);
    }

    return [true,''];
    
}


/**
 * @description Ensures that the body is valid for updating user permissions.
 * @returns {[boolean, string]} - success boolean followed by an error message if any.
 */
export function validateUpdateProjectMembers(req, project) {
    const {members} = req.body;
    const permissions = ['developer','project_manager','administrator'];
    if(members === null || Array.isArray(members) === false){
        return [false, 'Members must be an array'];
    }

    
    for(const member of members) {
        if(
            typeof member._id !== 'string' || 
            typeof member.role !== 'string' || 
            permissions.includes(member.role) === false
        ){
            return [false, '_id and role must be of type string, and must be one of the enumerated roles'];
        }
    }

    let allProjectMembers = new Set();
    let duplicateMembersSet = new Set();

    

    //make sure all members belong to project, and prevent duplicates
    for(const member of project.members){
        allProjectMembers.add(member._id.toString());
    }

    console.log(allProjectMembers)

    for(const member of members){
        if(duplicateMembersSet.has(member._id.toString()) === false)
            duplicateMembersSet.add(member._id.toString());
        else
            return [false, 'Cannot contain duplicate members']
        if(allProjectMembers.has(member._id.toString()) === false)
            return [false, 'Members must be added to project']
    }

    return [true,''];
}




export const updateProjectSchema = Yup.object().shape({
    title: Yup.string().notRequired(),
    description: Yup.string().notRequired(),
    members: Yup.array().test('is-string-array','please use array of strings',(value)=> {
        if(!value || value.length === 0) return true;
        return Array.isArray(value) && value.every((v)=> typeof v === 'string')
    }).notRequired(),
});



//check if each string or member is a valid object id
export const deleteProjectMemberSchema = Yup.object().shape({
    members: Yup.array().test('valid-objectId-array','use proper objectIds',(value)=> {
        if(value.length === 0) return false;
        return value.every(objectId => mongoose.Types.ObjectId.isValid(objectId));
    })
});