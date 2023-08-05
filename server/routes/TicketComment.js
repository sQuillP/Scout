import {Router} from 'express';

import {
    getTicketComments
} from '../controllers/TicketComment.js';

const TicketCommentRouter = Router({mergeParams: true});


TicketCommentRouter.route('/')
.get(getTicketComments);


export default TicketCommentRouter;