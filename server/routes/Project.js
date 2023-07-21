import express from 'express';
import {
    getProjects,
    getMyProjects,
    createProject,
    getProjectById
} from '../controllers/Project.js';
import authenticate from '../middleware/authenticate.js';


const ProjectRouter = express.Router();

//Enforce authentication for all project routes.
ProjectRouter.use(authenticate);

ProjectRouter.route('/')
.get(getProjects)
.post(createProject);


ProjectRouter.route('/myProjects')
.get(getMyProjects);


ProjectRouter.route('/myProjects/:projectId')
.get(getProjectById);


export default ProjectRouter;