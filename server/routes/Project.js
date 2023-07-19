import express from 'express';
import {
    getProjects,
    getMyProjects,
    createProject
} from '../controllers/Project.js';
import authenticate from '../middleware/authenticate.js';


const ProjectRouter = express.Router();


ProjectRouter.route('/')
.get(authenticate, getProjects)
.post(authenticate, createProject);

ProjectRouter.route('/myProjects')
.get(authenticate, getMyProjects);


export default ProjectRouter;