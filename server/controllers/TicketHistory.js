import TicketHistory from "../schema/TicketHistory.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";
import ErrorResponse from '../utility/ErrorResponse.js';
import { createTicketHistorySchema } from "./validators/TicketHistory.js";
import Project from '../schema/Project.js';
import Ticket from "../schema/Ticket.js";
import User from "../schema/User.js";


/**
 * @description - Get all ticket history items associated with one ticket.
 * @access authenticated, developer+
 * @method GET /ticketHistory
 */
export const getTicketHistoryFromTicket = asyncHandler( async(req,res, next)=> {

    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    console.log(req.query)
    if(limit <= 0 || page <= 0){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Limit and page must be greater or equal to zero. "
            )
        );
    }
 
    const fetchedHistory = await TicketHistory.find({
        ticket:req.params.ticketId,
    }).populate('modifiedBy')
    .skip((page-1)*limit)
    .limit(limit);

    const historyCount = await TicketHistory.find({
        ticket: req.params.ticketId
    })
    .countDocuments();


    
    res.status(status.OK).json({
        data: fetchedHistory,
        itemCount: historyCount
    });
});



/**
 * @method POST /api/v1/projects/myProjects/:projectId/tickets/:ticketId/ticketHistory
 * @description add a ticket to a projects ticket history.
 * @access authenticated, developer+
 */

export const addToTicketHistory = asyncHandler( async (req,res,next)=> {
    if(createTicketHistorySchema.isValidSync(req.body) === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
            )
        );
    }

    if((await Project.exists({_id: req.params.projectId})) === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Project "+req.params.projectId + " does not exist"
            )
        );
    }

    if((await Ticket.exists({_id: req.params.ticketId})) === null){
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "Ticket "+req.params.ticketId +" does not exist"
            )
        );
    }

    req.body['modifiedBy'] = req.user._id;
    
    console.log(req.body);

    await TicketHistory.create(req.body);

    const ticketData = await TicketHistory.find({ 
        ticket: req.body.ticket
    }).limit(5)
    .populate('modifiedBy');

    const totalTickets = await TicketHistory.countDocuments({
        ticket: req.body.ticket
    });

    res.status(status.OK).json({
        data: ticketData,
        totalItems: totalTickets
    });
});