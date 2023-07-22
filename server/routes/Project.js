import express from 'express';
import {
    getProjects,
    getMyProjects,
    createProject,
    getProjectById,
    updateProject
} from '../controllers/Project.js';
import { validateProjectPermission } from '../middleware/authorization.js'
import authenticate from '../middleware/authenticate.js';
import TicketRouter from './Ticket.js';


const ProjectRouter = express.Router();


//Enforce authentication for all project routes.
ProjectRouter.use(authenticate);



ProjectRouter.route('/')
.get(getProjects)
.post(createProject);


ProjectRouter.route('/myProjects')
.get(getMyProjects);


ProjectRouter.route('/myProjects/:projectId')
.get(//ensure all members have access to getting project information
    validateProjectPermission(['developer','project_manager','administrator']),
    getProjectById
)
.put(
    validateProjectPermission(['project_manager','administrator']),
    updateProject
);


ProjectRouter.use('/myProjects/:projectId/tickets',TicketRouter);

export default ProjectRouter;