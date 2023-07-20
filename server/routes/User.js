import { Router } from 'express';
import { getUsers } from '../controllers/User.js';


const UserRouter = Router();


UserRouter.route('/').get(getUsers);


export default UserRouter;
