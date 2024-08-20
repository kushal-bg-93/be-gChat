const response={
    notFoundError:(req,res,message)=>{
        return res.status(400).json({error:message,devInfo:"© Kushal API's"})
    },

    internalError:(req,res,message)=>{
        return res.status(500).json({error:message,devInfo:"© Kushal API's",message:"internal error"})
    },

    successResponse:(req,res,data)=>{
        return res.status(200).json({
            message:"Success",
            result:data,
            devInfo:"© Kushal API's"
        })
    }
}

module.exports=response;