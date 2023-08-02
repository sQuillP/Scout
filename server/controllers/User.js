import User from "../schema/User.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";


/**
 * @description - for development purposes only.
 */
export const getUsers = asyncHandler( async (req,res,next)=> {

    const userData = await User.find();

    res.status(status.OK).json({
        data: userData
    });

});



/**
 * @description - Search a user based on email or username
 * @method GET /api/v1/users/search
 * @param {string} term - query param for how to search for the user
 * @param {number} page - pagination page
 * @param {number} limit - max items per page
 * @access authenticated
 */
export const searchUsers = asyncHandler( async (req,res,next)=> {
    const term = req.query.term;
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    console.log(req.query);
    let query = {
        $or: [
            {firstName:{'$regex': term, '$options': 'i'}},
            {lastName: {"$regex": term, '$options': 'i'}},
            {email: {"$regex": term, "$options":'i'}}
        ]
    };

    const searchResult = await User.find(query)
    .skip((page-1)*limit)
    .limit(limit);


    res.status(status.OK).json({
        data: searchResult
    });
});