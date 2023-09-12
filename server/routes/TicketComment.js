import {Router} from 'express';

import {
    getTicketComments,
    createTicketComment
} from '../controllers/TicketComment.js';



const TicketCommentRouter = Router({mergeParams: true});

//Authorization already provided from parent router.
//authentication already provided from parent.


TicketCommentRouter.route('/')
.get(getTicketComments)
.post(createTicketComment);


export default TicketCommentRouter;