import Notification from "../schema/Notification.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";

/**
 * @description - get all notifications for a project and a related user
 * @access - authenticated, must belong to project
 */
export const getMyNotifications = asyncHandler( async (req,res,next)=> {

    console.log(req.params, req.user._id)

    const myNotifications = await Notification.find({
        individualReceiver: req.user._id,
        project: req.params.projectId        
    })
    .sort({createdAt: -1})
    .limit(5);


    res.status(status.OK).json({
        data: myNotifications
    });
});


/**
 * @description - delete a notification for a user
 * @access - authenticated, must belong to the project
 */
export const deleteNotification = asyncHandler( async (req,res,next)=> {
    

    await Notification.findByIdAndDelete(req.body.notification);

    const notifications = await Notification.find({
        individualReceiver: req.user._id,
        project: req.params.projectId,
    })
    .sort({createdAt: -1})
    .limit(5);

    res.status(status.OK).json({
        data: notifications
    });
});