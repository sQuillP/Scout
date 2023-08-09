import {Router,} from 'express';

import {
    getMyInvites,
    inviteUser
} from '../controllers/Invite.js';

import authenticate from '../middleware/authenticate.js';
import Invitation from "../schema/Invite.js";



const InviteRouter = Router();


InviteRouter.use(authenticate);


InviteRouter.route('/')
.get(getMyInvites)
.post(inviteUser);


export default InviteRouter;