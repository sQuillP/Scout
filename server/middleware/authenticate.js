import jsonwebtoken from 'jsonwebtoken';
import ErrorResponse from '../utility/ErrorResponse.js';
import status from '../utility/status.js';



/**
 * 
 * @description - Middleware for ensuring a user is logged in before accessing
 * a resource.
 * @returns next() middleware function call.
 */
export default function authenticate(req,res,next) {

    let tokenStr = null;

    //Authorization or authorization is good
    if(typeof req.headers.Authorization === 'string')
        tokenStr = req.headers.Authorization;
    else
        tokenStr = req.headers.authorization;

    if(typeof tokenStr !== 'string' || tokenStr.length === 0) {
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Not authorized"
            )
        );
    }

    const tokenDetails = tokenStr.split(' ');

    if(tokenDetails.length === 1 || tokenDetails[0].toLowerCase() !== 'bearer'){
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "invalid token format. use: Authorization: 'bearer {authtoken}"
            )
        );
    }

    try{
        const validToken = jsonwebtoken.verify(tokenDetails[1],process.env.JWT_SECRET);
        console.log(validToken);
        req.user = validToken;
        next();
    } catch(error) {
        return next(
            new ErrorResponse(
                status.BAD_REQUEST,
                "Invalid token"
            )
        );
    }
}