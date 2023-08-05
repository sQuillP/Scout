import TicketComment from '../schema/TicketComment.js';
import asyncHandler from '../utility/asyncHandler.js';
import status from '../utility/status.js';


/**
 * @description - get all comments associated with ticket. You
 * can skip by five
 * @access authorized, developer+ (must be in the project)
 * @method GET /api/v1/projects/myProjects/projectId/tickets/:ticketId/comments
 */
export const getTicketComments = asyncHandler( async (req,res,next)=> {

    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;

    const ticketComments = await TicketComment.find({
        ticket: req.params.ticketId
    })
    .populate('author')
    .skip((page-1)*limit)
    .limit(limit);

    const ticketCommentCount = await TicketComment.find({
        ticket: req.params.ticketId
    }).countDocuments();

    

    res.status(status.OK).json({
        data: ticketComments,
        itemCount: ticketCommentCount
    });

});