import User from "../schema/User.js";
import asyncHandler from "../utility/asyncHandler.js";
import status from "../utility/status.js";


export const getUsers = asyncHandler( async (req,res,next)=> {

    const userData = await User.find();

    res.status(status.OK).json({
        data: userData
    });

});