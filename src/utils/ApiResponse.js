class ApiResponse{
    constructor(data,message,statusCode){
         this.data = data;
         this.message = message;
         this.success =true ;
         this.status = statusCode < 400;
    }
}

export {ApiResponse}