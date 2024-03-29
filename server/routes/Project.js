import express from 'express';
import {
    getProjects,
    getMyProjects,
    createProject,
    getProjectById,
    updateProjectMembers,
    updateProject,
    refreshProjectKey,
    deleteMember,
    deleteProject

} from '../controllers/Project.js';
import { validateDeleteMember, validateProjectPermission, validateUpdateProject, validateDeleteProject } from '../middleware/authorization.js'
import authenticate from '../middleware/authenticate.js';
import TicketRouter from './Ticket.js';


const ProjectRouter = express.Router();


//Enforce authentication for all project routes.
// ProjectRouter.use(authenticate);



ProjectRouter.route('/')
.all(authenticate)
.get(getProjects)
.post(createProject);


ProjectRouter.route('/myProjects')
.all(authenticate)
.get(getMyProjects);


ProjectRouter.route('/myProjects/:projectId')
.all(authenticate)
.get(//ensure all members have access to getting project information
    validateProjectPermission(['developer','project_manager','administrator']),
    getProjectById
)
.put(
    validateProjectPermission(['administrator']),
    validateUpdateProject(),
    updateProject
)
.delete(
    validateDeleteProject(),
    deleteProject
)

ProjectRouter.route("/myProjects/:projectId/refreshAPIKey")
.all(authenticate)
.put(
    validateProjectPermission(['administrator']),
    refreshProjectKey
);

ProjectRouter.route('/myProjects/:projectId/members')
.all(authenticate)
.put(
    validateProjectPermission(['administrator']),
    updateProjectMembers
)
.delete(
    validateProjectPermission(['administrator','project_manager']),
    validateDeleteMember(),
    deleteMember
);


//extend the route to the tickets associated with the route.
ProjectRouter.use('/myProjects/:projectId/tickets',TicketRouter);

export default ProjectRouter;