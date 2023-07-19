/**
 * This helps with taking the response status message down the middleware pipeline.
 */
export default class ErrorResponse extends Error {
    constructor(status,message){
        super(message);
        this.status = status;
    }
}