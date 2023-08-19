import {Router,} from 'express';

import {
    getMyInvites,
    inviteUser,
    deleteInvitation,
    getProjectInvites,
    acceptInvite,
    rejectInvite,
} from '../controllers/Invite.js';

import authenticate from '../middleware/authenticate.js';
import { 
    validateProjectPermission,
    validateDeleteInvite,
    validateCreateInvite,
    validateAcceptOrRejectInvite,
} from '../middleware/authorization.js';



const InviteRouter = Router();

/* Make sure user is authenticated (user is attached to the request object) */
InviteRouter.use(authenticate);


InviteRouter.route('/')
InviteRouter.route('/')
.get(getMyInvites)
.post(
    validateCreateInvite(['project_manager','administrator']),
    inviteUser
)
.delete(
    validateDeleteInvite(
        ['project_manager','administrator']
    ),
    deleteInvitation
);


InviteRouter.route('/acceptInvite')
.post(
    validateAcceptOrRejectInvite(),
    acceptInvite
);

InviteRouter.route('/rejectInvite')
.post(
    validateAcceptOrRejectInvite(),
    rejectInvite
);

//get all projectInvites
InviteRouter.route('/projects/:projectId')
.get(
    validateProjectPermission(
        ["administrator","project_manager","developer"]
    ),
    getProjectInvites
);


export default InviteRouter;