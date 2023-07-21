import User from "../../schema/User.js";
import status from "../../utility/status.js";


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
 * @description validate body types, ensure project belongs to user,
 * 
 */
export async function validateUpdateProjectBody() {

}