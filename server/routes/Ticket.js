import express from 'express';

import {
    getTickets, 
    getTicketById,
    updateTicketById,
    createTicket,
} from '../controllers/Ticket.js';

import { validateCreateTicket, validateProjectPermission } from '../middleware/authorization.js';
import TicketHistoryRouter from './TicketHistory.js';
import TicketCommentRouter from './TicketComment.js';

/**
 * NOTE: This router extends the project router in order to get the tickets.
 * This means any auth middleware should not be applied in this file.
 */

const TicketRouter = express.Router({mergeParams: true});

TicketRouter.use(
    validateProjectPermission(['developer','project_manager','administrator'])
);


TicketRouter.route('/')
.get(//make sure that tickets are restricted to members of the group to view
    getTickets
)
.post(
    validateCreateTicket(),
    createTicket
);

TicketRouter.route("/:ticketId")
.get(
    getTicketById
)
.put(
    updateTicketById
);


//append ticket history
TicketRouter.use('/:ticketId/ticketHistory',TicketHistoryRouter);

TicketRouter.use('/:ticketId/comments', TicketCommentRouter); 

export default TicketRouter;