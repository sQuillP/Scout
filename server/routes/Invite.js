import {Router,} from 'express';

import {
    getMyInvites,
    inviteUser,
    deleteInvitation,
    getProjectInvites,
    acceptInvites,
} from '../controllers/Invite.js';

import authenticate from '../middleware/authenticate.js';
import { 
    validateProjectPermission,
    validateDeleteInvite,
    validateInvite,
} from '../middleware/authorization.js';
import Invitation from "../schema/Invite.js";



const InviteRouter = Router();


InviteRouter.use(authenticate);


InviteRouter.route('/')
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

InviteRouter.route('/:projectId/accept')
.post(
    acceptInvites
);



export default InviteRouter;