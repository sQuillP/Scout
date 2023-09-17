import TicketComment from '../schema/TicketComment.js';
import asyncHandler from '../utility/asyncHandler.js';
import status from '../utility/status.js';
import { createTicketCommentSchema } from './validators/TicketComment.js';
import ErrorResponse from '../utility/ErrorResponse.js';
import Ticket from '../schema/Ticket.js';
import User from '../schema/User.js';
import mongoose from 'mongoose';
import Notification from '../schema/Notification.js';
import Project from '../schema/Project.js';

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
    const query = {
        ticket: req.params.ticketId,
    };

    
    if(Boolean(term) !== false){
        query['content']={"$regex": term, "$options":'i'};
    }
    if(!!req.query?.filters?.startDate) {
        query['createdAt'] = {$gte: new Date(req.query.filters.startDate)};
    }
    if(!!req.query?.filters?.endDate) {
        query['createdAt']["$lte"] =  new Date(req.query.filters.endDate);
    }
    if(!!req.query?.filters?.user) {
        query['author'] = req.query?.filters?.user;
    }
    const ticketComments = await TicketComment.find(query)
    .populate('author')
    .skip((page-1)*limit)
    .limit(limit);
    const ticketCommentCount = await TicketComment.find(query)
    .countDocuments();
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

    const fetchedTicket = await Ticket.findById(req.params.ticketId);

    if(fetchedTicket === null) {
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "ticket "+ req.params.ticketId + " does not exist"
            )
        );
    }

    req.body['author'] = req.user._id;
    req.body['ticket'] = req.params.ticketId;



    const createdComment = await TicketComment.create(req.body);
    const totalComments = await TicketComment.countDocuments({ticket: req.params.ticketId});

    const fetchedUser = await User.findById(req.user._id);



    //if the user comments on their own ticket, then they should not receive a notification.
    if(createdComment.author._id.toString() !== fetchedTicket.assignedTo.toString()) {
        const notificationId = new mongoose.Types.ObjectId();

        const notification = {
            notificationFor: 'comment',
            title: `${fetchedUser.firstName} ${fetchedUser.lastName} commented on your ticket`,
            description: createdComment.content,
            ticket: fetchedTicket._id.toString(),
            _id: notificationId
        }

        await Notification.create({
            ...notification,
            project: req.params.projectId,
            _id: notificationId,
            individualReceiver: fetchedTicket.assignedTo
        });
        
        const io = req.app.get('socketio');
        io.in(fetchedTicket.assignedTo.toString()).emit('receiveNotification',notification);
    }
    
    const ticketResponse = await TicketComment.find({ticket: req.params.ticketId})
    .limit(5)
    .populate('author');


    res.status(status.CREATED).json({
        data: ticketResponse,
        itemCount: totalComments,
    });
});
