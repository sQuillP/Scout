import TicketHistory from "../schema/TicketHistory.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";
import ErrorResponse from '../utility/ErrorResponse.js';


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