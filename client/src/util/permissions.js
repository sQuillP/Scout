const USER_ROLES = ['developer','administrator','project_manager'];


/**
 * @description - 
 * @param {string} role 
 * @returns {boolean} true if user can change other users permissions
 */
export function canEditUserPermissions(role) {
    return role !== 'developer' && role !== 'project_manager';
}

/**
 * @description - 
 * @param {string} role role of user in project.
 */
export function canModifyProject(role) {

    return role !== 'developer';
}


//... all auth functions go in this file.