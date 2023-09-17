import express from 'express';
import {
    deleteNotification,
    getMyNotifications
} from '../controllers/Notification.js'
import authenticate from '../middleware/authenticate.js';
import { validateDeleteNotification } from '../middleware/authorization.js';

const NotificationRouter = express.Router();

NotificationRouter.use(authenticate);

NotificationRouter.route('/:projectId')
.get(
    getMyNotifications
)
.delete(
    validateDeleteNotification(),
    deleteNotification
)


export default NotificationRouter;