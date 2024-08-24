const {notFoundError,internalError, successResponse}=require('../../utils/response')
const {successMessages,errorMessages}=require('../../utils/messages')
const {search,pagination, findOne, find}=require('../../models/queries/commonQuery')
const mongoose=require('mongoose')
const Group=require('../../models/schemas/Group')

const user={

    searchUser:async(req,res)=>{
        try {
            const {search,page}=req?.query
            const query={name:{$regex:search,$options:'i'}}
            const sort={_id:-1}
            const limit=5
            const searchResult=await pagination('User',query,sort,limit,page||0,{name:1,email:1})

            return successResponse(req,res,{messages:successMessages?.success,result:searchResult})
            
        } catch (error) {
            console.log(error?.message)
            return internalError(req,res,error.message)
        }
    },

    getMyGroups:async(req,res)=>{
        try {
            const id=req?.userData?._id

            const groups=await Group.find({users:new mongoose.Types.ObjectId(req?.userData?._id)},{name:1,latestMessage:1,adminId:1}).populate({path:'latestMessage',select:'content senderId'}).populate({path:'latestMessage.senderId', select:'name email imageId'})

            return successResponse(req,res,{message:successMessages?.success,data:groups})

        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
        }
    }
}

module.exports=user