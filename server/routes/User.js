import { Router } from 'express';
import { 
    getUsers,
    searchUsers
 } from '../controllers/User.js';
import authenticate from '../middleware/authenticate.js';


const UserRouter = Router();

//Ensure users are authenticated into application.
UserRouter.use(authenticate);


UserRouter.route('/').get(getUsers);

UserRouter.route('/search')
.get(searchUsers);

export default UserRouter;
