import status from "../utility/status.js";



const errorRoute =  async (error, req,res,next)=> {
    console.log('error route is firing');
    console.log(error);
    res.status(error.status || status.INTERNAL_SERVER_ERROR).json({
        error: error.message,
    });
};

export default errorRoute;