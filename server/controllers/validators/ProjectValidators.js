import status from "../../utility/status.js";


/**
 * 
 * @param {RequestObject}  req 
 * @param {()=> null} next - calls the next middleware function
 * @returns 
 */
export function validateCreateProjectBody(req) {
    const projectFormat = ['title','description'];
    const memberBodyFormat = ['profileImage','firstName','lastName','email','role', '_id'];
    const roles = ['administrator','project_manager','developer']
    let validBody = true;

    if(Object.keys(req.body).length !== projectFormat.length)
        return false;

    //validate the project object.
    projectFormat.forEach((key)=> {
        if(typeof req.body[key] !== 'string'){
            return false;
        } 
    });

     //validate the members object
     req.body.members.forEach((member)=> {
        //ensure each member has 4 fields
        if(Object.keys(member).length !== memberBodyFormat.length){
            return false;
        }
        //ensure that each member field is a string
        memberBodyFormat.forEach((memberKey)=> {
            if(typeof member[memberKey] !== 'string')
                return false;
            //must include one of the roles
            if(memberKey === 'role' && roles.includes(member[memberKey]) === false)
                return false;
        });
    });

    return true;
    
}