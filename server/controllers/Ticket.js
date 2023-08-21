import Ticket from "../schema/Ticket.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";
import { updateTicketSchema, createTicketSchema } from "./validators/Ticket.js";

function buildTicketQuery(query, filters){
    if(filters === undefined) return query;
    Object.keys(filters).forEach((filter)=> {
        if(Array.isArray(filters[filter]) === true){
            query[filter] = {
                $in: filters[filter]
            };
        }
        else {
            query[filter] = filters[filter]._id
        }
    });
    return query;
}



/**
 * @description - Get all tickets associated with a project
 * @method GET - /tickets
 * @access authenticated, developer+
 */
export const getTickets = asyncHandler( async (req,res,next)=> {
    console.log('in gettickets')
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const filters = req.query.filters;

    const query = {project: req.params.projectId};

    if(filters !== undefined){
        Object.keys(filters).forEach((filter)=> {
            if(Array.isArray(filters[filter]) === true){
                query[filter] = {
                    $in: filters[filter]
                };
            }
            else {
                query[filter] = filters[filter]._id
            }
        });
        
    }



    //Remember to add filters

    const totalTickets = await Ticket.find(query).countDocuments();

    let tickets = Ticket.find(query)
    .populate('assignedTo')
    .skip((page-1)*limit)
    .limit(limit);

    if(filters?.sortBy !== undefined){
        tickets.sort({createdAt: Number(filters.sortBy)});
    }

    tickets = await tickets;

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
    const validBody = updateTicketSchema.isValidSync(req.body);
    console.log(validBody, req.body);
    if(validBody === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid request body"
            )
        );
    }

    if((await Ticket.exists({_id: req.params.ticketId}) === null)){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Ticket " + req.params.ticketId + " does not exist"
            )
        );
    }

   
    console.log('line 81',req.body);

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.ticketId,{
        ...req.body
    },{new:true});


    

    res.status(status.OK).json({
        data: updatedTicket
    });
});



/**
 * @description - create a new ticket instance
 * 
 */
export const createTicket = asyncHandler( async (req,res,next)=> {

    const limit = req.query.limit || 10;

    const createdTicket = await Ticket.create(req.body);


    const totalItems = await Ticket.countDocuments();
    

    const tickets = await Ticket.find()
    .limit(limit)
    .populate('assignedTo');

    res.status(status.CREATED).json({
        data: tickets,
        totalItems
    });


});