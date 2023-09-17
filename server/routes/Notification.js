import express from 'express';
import {
    deleteNotification,
    getMyNotifications
} from '../controllers/Notification.js'
import authenticate from '../middleware/authenticate.js';

const NotificationRouter = express.Router();

NotificationRouter.use(authenticate);

NotificationRouter.route('/')
.get(
    getMyNotifications
)
.delete(
    deleteNotification
)


export default NotificationRouter;