import express from 'express';

import {
    getTickets,

} from '../controllers/Ticket.js';

import { validateProjectPermission } from '../middleware/authorization.js';

/**
 * NOTE: This router extends the project router in order to get the tickets.
 * This means any auth middleware should not be applied in this file.
 */

const TicketRouter = express.Router({mergeParams: true});

TicketRouter.route('/')
.get(//make sure that tickets are restricted to members of the group to view
    validateProjectPermission(['developer','project_manager','administrator']),
    getTickets
);




export default TicketRouter;