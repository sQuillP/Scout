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


/**
 * @description fetch a single ticket instance using the ticketId param field
 * @access authenticated, developer+
 * @method GET /tickets/:ticketId
 */
export const getTicketById = asyncHandler( async (req,res,next)=> {

    const fetchedTicket = await Ticket.findById(req.params.ticketId);

    res.status(status.OK).json({
        data: fetchedTicket
    });
});



/**
 * @description - update a ticket 
 * @access authenticated, developer+
 * @method PUT /ticket/:ticketId
 */
export const updateTicketById = asyncHandler( async (req,res,next)=> {

});