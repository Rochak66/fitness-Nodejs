module.exports={
    errorResponseWithData:(res,msg,data)=>{
        return res.status(400).json({
            status:400,
            message:msg,
            data:data
        })
    },
    errorResponse:(res,msg) =>{
        return res.status(400).json({
            status:400,
            message:msg
        })
    },
    successResponseWithDataAndToken:(res,msg,data,token)=>{
        return res.status(200).json({
            status:200,
            message:msg,
            data:data,
            token:token
        });
    },
    successResponseWithData:(res,msg,data)=>{
        return res.status(200).json({
            status:200,
            message:msg,
            data:data
        })
    },
    notFound: function(res, message) {
        if (message === undefined) {
            message = "Resource not found";
        }
        return res.status(404).json({
            status: 'error',
            message: message
        });
    },
    serverError: function(res, message) {
        if (message === undefined) {
            message = "Internal server error";
        }
        return res.status(500).json({
            status: 'error',
            message: message
        });
    },
    success: function(res, data, message) {
        if (message === undefined) {
            message = "Operation successful";
        }
        return res.status(200).json({
            status: 'success',
            message: message,
            data: data
        });
    },
    badRequest: function(res, message) {
        if (message === undefined) {
            message = "Bad request";
        }
        return res.status(400).json({
            status: 'error',
            message: message
        });
    },

    unauthorized: function(res, message) {
        if (message === undefined) {
            message = "Unauthorized access";
        }
        return res.status(401).json({
            status: 'error',
            message: message
        });
    },

    successResponse: function(res,message){
        if(message === undefined){
            message= "succsess";
        }
        return res.status(200).json({
            status: 'success',
            message: message
        });

    }
}