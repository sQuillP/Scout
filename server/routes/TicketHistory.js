import express from 'express';
import { 
    getTicketHistoryFromTicket 
} from '../controllers/TicketHistory.js';


/**
 * NOTE: This route extension starts as the following:
 * Project -> Ticket -> TicketHistory
 * Auth sits at the project level
 */
const TicketHistoryRouter = express.Router({mergeParams:true});


TicketHistoryRouter.route('/')
.get(getTicketHistoryFromTicket);



export default TicketHistoryRouter; 