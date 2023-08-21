import express from 'express';

import {
    getTickets, 
    getTicketById,
    updateTicketById,
    createTicket,
} from '../controllers/Ticket.js';

import { validateProjectPermission } from '../middleware/authorization.js';
import TicketHistoryRouter from './TicketHistory.js';
import TicketCommentRouter from './TicketComment.js';

/**
 * NOTE: This router extends the project router in order to get the tickets.
 * This means any auth middleware should not be applied in this file.
 */

const TicketRouter = express.Router({mergeParams: true});


TicketRouter.route('/')
.get(//make sure that tickets are restricted to members of the group to view
    validateProjectPermission(['developer','project_manager','administrator']),
    getTickets
)
.post(
    createTicket
);

TicketRouter.route("/:ticketId")
.get(
    //all members
    validateProjectPermission(['developer','project_manager','administrator']),
    getTicketById
)
.put(//all members
    validateProjectPermission(['developer','project_manager','administrator']),
    updateTicketById
);


//append ticket history
TicketRouter.use('/:ticketId/ticketHistory',TicketHistoryRouter);

TicketRouter.use('/:ticketId/comments', TicketCommentRouter); 

export default TicketRouter;