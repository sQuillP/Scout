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

    const limit = 5;
    // const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;
    const term = req.query.term;


    const query = {
        ticket: req.params.ticketId,
    };

    if(term !== undefined){
        query['content']={"$regex": term, "$options":'i'};
        console.log('doing the query',term);
    }

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



// /**
//  * @description - search comments and their content
//  * @access - developer+, authenticated
//  */
// export const searchComment = asyncHandler( async(req,res,next)=> {
//     const COMMENT_LIMIT = 5;
//     const term = req.query.term;
//     const currentPage = req.query.page || 1;
//     //more filters

//     //use regex to find ticket comments
//     const commentData = await TicketComment.find({
//         ticket:req.params.ticketId,
//         content: {"$regex":term, "$options":'i'}
//     })
//     .popular('author')
//     .skip((currentPage-1)*COMMENT_LIMIT)
//     .limit(COMMENT_LIMIT);

//     res.status(status.OK).json({
//         data: commentData
//     });


// });