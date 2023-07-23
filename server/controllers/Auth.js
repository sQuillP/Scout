import jsonwebtoken from 'jsonwebtoken';
import User from '../schema/User.js';
import asyncHandler from '../utility/asyncHandler.js';
import ErrorResponse from '../utility/ErrorResponse.js';
import status from '../utility/status.js';
import bcrypt from 'bcrypt';
import { validateSignupBody, validateLoginBody} from './validators/Auth.js';

/**
 * @access public
 * @method POST /api/v1/auth/login
 */
export const login = asyncHandler( async (req,res,next)=> {
    const { email, password } = req.body;

    

    /* if invalid body exists */
    if(await validateLoginBody.isValid({email, password}) === false) {
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid login form"
            )
        );
    }

    const fetchedUser = await User.findOne({email}).select('+password');

    /* if user does not exist */
    if(fetchedUser === null) {
        return next(
            new ErrorResponse(
                status.NOT_FOUND,
                "User does not exist"
            )
        );
    }

    //Check valid password
    const validPassword = await bcrypt.compare(req.body.password, fetchedUser.password);
    
    if(validPassword === false) {
        return next(
            new ErrorResponse(
                status.UNAUTHORIZED,
                "Invalid credentials"
            )
        );
    }

    //create user payload without password
    const userPayload = {...fetchedUser._doc};
    delete userPayload.password;

    //Issue a new jwt token
    const token = jsonwebtoken.sign(userPayload, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });

    return res.status(status.OK).json({
        token,
    });
});



/**
 * @access Public
 * @method POST /api/v1/auth/signup
 */
export const signUp = asyncHandler( async (req,res,next)=> {

    if((await validateSignupBody.isValid({...req.body})) === false){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                'invalid request body'
            )
        );
    }

    /* Check to see if user already exists */
    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser !== null){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Email already exists"
            )
        )
    }


    const newUser = await User.create(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();

    const userPayload = {...newUser._doc};
    delete userPayload.password;

    const token = jsonwebtoken.sign(userPayload,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
    return res.status(status.CREATED).json({
        token
    });
});

