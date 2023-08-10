import {Router,} from 'express';

import {
    getMyInvites,
    inviteUser,
    deleteInvitation,
    getProjectInvites,
} from '../controllers/Invite.js';

import authenticate from '../middleware/authenticate.js';
import { 
    validateProjectPermission,
    validateDeleteInvite
} from '../middleware/authorization.js';
import Invitation from "../schema/Invite.js";



const InviteRouter = Router();


InviteRouter.use(authenticate);


InviteRouter.route('/:projectId')
.get(getMyInvites)
.post(inviteUser)
.delete(
    validateDeleteInvite(
        ['project_manager','administrator']
    ),
    deleteInvitation
);

//get all projectInvites
InviteRouter.route('/:projectId')
.get(
    validateProjectPermission(
        ["administrator","project_manager","developer"]
    ),
    getProjectInvites
);



export default InviteRouter;