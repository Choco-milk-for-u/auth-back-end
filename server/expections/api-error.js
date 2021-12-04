module.exports = class ApiErrors extends Error{
    status;
    errors;

    constructor(status,message,errors = []){
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static unAthorization(){
        return new ApiErrors(401,'text about unathiruzation')
    }
    static badRequest(message,errors = []){
        return new ApiErrors(400,message,errors);
    }
}