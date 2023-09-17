import express from 'express';
import { 
    getTicketHistoryFromTicket,
    addToTicketHistory 
} from '../controllers/TicketHistory.js';
import { validateProjectPermission } from '../middleware/authorization.js';

/**
 * NOTE: This route extension starts as the following:
 * Project -> Ticket -> TicketHistory
 * Auth sits at the project level
 * 
 * IMPORTANT: this route should eventually be removed as 
 * logic for adding to ticket history should be part of the 
 * request body for updating a ticket. Users can make requests to the server
 * and populate the ticket history.
 */
const TicketHistoryRouter = express.Router({mergeParams:true});




TicketHistoryRouter.route('/')
.get(getTicketHistoryFromTicket)
.post(addToTicketHistory);


export default TicketHistoryRouter; 