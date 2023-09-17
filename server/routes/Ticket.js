import express from 'express';
import {
    getTickets, 
    getTicketById,
    updateTicketById,
    createTicket,
    submitError
} from '../controllers/Ticket.js';

import { validateCreateTicket, validateProjectPermission, validateSubmitError } from '../middleware/authorization.js';
import TicketHistoryRouter from './TicketHistory.js';
import TicketCommentRouter from './TicketComment.js';
import authenticate from '../middleware/authenticate.js';

/**
 * NOTE: This router extends the project router in order to get the tickets.
 * This means any auth middleware should not be applied in this file.
 */

const TicketRouter = express.Router({mergeParams: true});

TicketRouter.route('/')
.all(authenticate, validateProjectPermission(['developer','project_manager','administrator']))
.get(//make sure that tickets are restricted to members of the group to view
    getTickets
)
.post(
    validateCreateTicket(),
    createTicket
);


TicketRouter.route('/recordError')
.post(
    validateSubmitError(),
    submitError
);


TicketRouter.route("/:ticketId")
.all(authenticate, validateProjectPermission(['developer','project_manager','administrator']))
.get(
    getTicketById
)
.put(
    updateTicketById
);



//mount authenticate after recordError
TicketRouter.use(authenticate);
TicketRouter.use(validateProjectPermission(['developer','project_manager','administrator']));

//append ticket history
TicketRouter.use('/:ticketId/ticketHistory',TicketHistoryRouter);
TicketRouter.use('/:ticketId/comments', TicketCommentRouter); 

export default TicketRouter;