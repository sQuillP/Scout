import TicketComment from '../schema/TicketComment.js';
import asyncHandler from '../utility/asyncHandler.js';
import status from '../utility/status.js';
import { createTicketCommentSchema } from './validators/TicketComment.js';
import ErrorResponse from '../utility/ErrorResponse.js';
import Ticket from '../schema/Ticket.js';

/**
 * @description - get all comments associated with ticket. You
 * can skip by five
 * @access authorized, developer+ (must be in the project)
 * @method GET /api/v1/projects/myProjects/projectId/tickets/:ticketId/comments
 */
export const getTicketComments = asyncHandler( async (req,res,next)=> {

    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;
    const term = req.query.term;

    console.log(req.query);

    const query = {
        ticket: req.params.ticketId,
    };

    console.log('in getTicketComments')

    if(Boolean(term) !== false){
        query['content']={"$regex": term, "$options":'i'};
        console.log('doing the query',term);
    }


    const ticketComments = await TicketComment.find(query)
    .populate('author')
    .skip((page-1)*limit)
    .limit(limit);

    const ticketCommentCount = await TicketComment.find(query)
    .countDocuments();

    console.log('item count: ',ticketComments.length)

    res.status(status.OK).json({
        data: ticketComments,
        itemCount: ticketCommentCount
    });

});




/**
 * @description - add a new comment to a ticket, send first 5
 * tickets to the user
 * @method POST /api/v1/projects/myProjects/projectId/tickets/:ticketId/comments
 * @access authenticated, developer+ must belong to project
 */
export const createTicketComment = asyncHandler( async (req,res,next)=> {
    if(createTicketCommentSchema.isValidSync(req.body) === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
            )
        );
    }

    if((await Ticket.exists({_id: req.params.ticketId})) === false) {
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "ticket "+ req.params.ticketId + " does not exist"
            )
        );
    }
    


    req.body['author'] = req.user._id;
    req.body['ticket'] = req.params.ticketId;

    await TicketComment.create(req.body);
    const totalComments = await TicketComment.countDocuments({ticket: req.params.ticketId});
    
    
    const ticketResponse = await TicketComment.find({ticket: req.params.ticketId})
    .limit(5)
    .populate('author');


    res.status(status.CREATED).json({
        data: ticketResponse,
        itemCount: totalComments,
    });
});
