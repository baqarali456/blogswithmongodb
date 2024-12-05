class ApiError extends Error{
    constructor(message="Something Went Wrong",status,errors=[]){
        super(message)
        this.status = status;
        this.success = false;
        this.message = message;
        this.data = null;
        this.errors = errors;

        if(stack) this.stack = stack;
        else Error.captureStackTrace(this,this.constructor)
    }
}