import { Router } from 'express';
import { 
    getUsers,
    searchUsers,
    updatePassword,
    updateProfile
 } from '../controllers/User.js';

import { validateUpdateUserPassword, validateUpdateUser } from '../middleware/authorization.js';
import authenticate from '../middleware/authenticate.js';


const UserRouter = Router();

//Ensure users are authenticated into application.
UserRouter.use(authenticate)


UserRouter.route('/').get(getUsers);


UserRouter.route('/updateDetails').put(
    validateUpdateUser(),
    updateProfile
);

UserRouter.route('/changePassword').put(
    validateUpdateUserPassword(),
    updatePassword
);

UserRouter.route('/search')
.get(searchUsers);

export default UserRouter;
