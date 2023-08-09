import {Router} from 'express';

import {
    getTicketComments,
    createTicketComment
} from '../controllers/TicketComment.js';

import {
    validateProjectPermission
} from '../middleware/authorization.js';

const TicketCommentRouter = Router({mergeParams: true});

//Authorization already provided from parent router.

TicketCommentRouter.use(
    validateProjectPermission(
        ["administrator","project_manager","developer"]
    )
);

TicketCommentRouter.route('/')
.get(getTicketComments)
.post(createTicketComment);


export default TicketCommentRouter;