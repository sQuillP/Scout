import { login, signUp} from '../controllers/Auth.js';
import express from 'express';


const AuthRouter = express.Router();

AuthRouter.route('/login').post(login);
AuthRouter.route('/signup').post(signUp);


export default AuthRouter;

