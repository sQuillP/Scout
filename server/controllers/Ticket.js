import Ticket from "../schema/Ticket.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";




/**
 * @description - Get all tickets associated with a project
 * @method GET - /tickets
 * @access authenticated, developer+
 */
export const getTickets = asyncHandler( async (req,res,next)=> {
    console.log('in gettickets')
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    //Remember to add filters

    const totalTickets = await Ticket.find({project:req.params.projectId}).countDocuments();

    const tickets =  await Ticket.find({
        project: req.params.projectId,
    })
    .skip((page-1)*limit)
    .limit(limit);


    res.status(status.OK).json( {
        data: tickets,
        totalItems: totalTickets
    });
});