import User from "../schema/User.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";
import bcrypt from 'bcrypt';

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
            {email: {"$regex": term, "$options": 'i'}}
        ]
    };

    const searchResult = await User.find(query)
    .skip((page-1)*limit)
    .limit(limit);


    res.status(status.OK).json({
        data: searchResult
    });
});


/**
 * @description updates user profile from request body
 * @method PUT
 * @access authenticated
 */
export const updateProfile = asyncHandler( async (req,res,next)=> {

    const updatedUser = await User.findByIdAndUpdate(req.user._id,req.body,{new: true, runValidators: true});

    res.status(status.OK).json({
        data: updatedUser
    });
});



/**
 * @description updates a users password for them
 * @method PUT
 * @access authenticated
 */
export const updatePassword = asyncHandler( async (req,res,next)=> {

    const fetchedUser = await User.findById(req.user._id);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.newPassword,salt);

    fetchedUser.password = hash;

    await fetchedUser.save()

    const responseUser = fetchedUser.toObject();

    delete responseUser.password;
    

    res.status(status.OK).json({
        data: responseUser
    });

});


