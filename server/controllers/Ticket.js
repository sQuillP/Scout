import Ticket from "../schema/Ticket.js";
import ErrorResponse from "../utility/ErrorResponse.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";
import { updateTicketSchema, createTicketSchema } from "./validators/Ticket.js";
import Project from '../schema/Project.js';
import Notification from "../schema/Notification.js";




/**
 * @description - Get all tickets associated with a project
 * @method GET - /tickets
 * @access authenticated, developer+
 */
export const getTickets = asyncHandler( async (req,res,next)=> {
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

    if(req.query.assignedTo) {
        query['assignedTo'] = req.query.assignedTo;
    }

    if(req.query.progress) {
        query['progress'] = 'open';
    }

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


    const totalItems = await Ticket.countDocuments({project: req.params.projectId});
    

    const tickets = await Ticket.find({project: req.params.projectId})
    .limit(limit)
    .populate('assignedTo');

    res.status(status.CREATED).json({
        data: tickets,
        totalItems
    });


});



/**
 * @description - Send a request to the server creating a new ticket instance from 
 * an error. Assigns a ticket to a random user. Sends notifications for users to receive
 * updates in socketio if connected to the room.
 * 
 * @method POST /api/v1/tickets/:ticketId/recordError
 * @access API Key required, no auth
 */
export const submitError = asyncHandler( async (req,res,next)=> {
    //assign ticket to random user on team
    const project = await Project.findOne({APIKey: req.headers.apikey});

    const randomProjectMember = project.members[Math.floor(Math.random()*project.members.length)];

    const createdTicket = await Ticket.create({
        project:project._id,
        priority:'high',
        assignedTo: randomProjectMember,
        progress:'open',
        ticketType:'crash',
        description: 'App crash detected in ' + project.title,
        summary:req.body.description
    });

    //prepare project notification
    const projectErrorNotification = {
        description: req.body.description,
        title: "Error discovered in " + project.title,
        notificationFor: 'ticket',
    };

    //prepare ticket notification body to assigned user
    const ticketNotification = {
        description: 'Ticket ' + createdTicket._id.toString() + " has been assigned to you",
        title:"This is an auto generated message from the server.",
        notificationFor:'change'
    }

    const io = req.app.get('socketio');
    //generate a new notification for each user
    //save the error message to the db for when the next user wants to log on
    for( let i = 0; i<project.members.length; i++) {
        const notification = await Notification.create({
            project: project._id,
            title: 'Error discovered in ' + project.title,
            description: req.body.description, 
            notificationFor:'ticket'
        });
    }

    const ticketNotificationObject = await Notification.create({
        project: project._id,
        description: 'Ticket ' + createdTicket._id.toString() + " has been assigned to you",
        title:"This is an auto generated message from the server.",
        notificationFor:'change',
        individualReceiver:randomProjectMember._id.toString()
    });

    //send notifications to all users in the project.
    io.in(project._id.toString()).emit('receiveNotification',projectErrorNotification);
    io.in(randomProjectMember._id.toString()).emit('receiveNotification',ticketNotification);


    res.status(status.CREATED).json({
        data: 'successful notification'
    });
});