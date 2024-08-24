const {notFoundError,internalError, successResponse}=require('../../utils/response')
const {errorMessages,successMessages}=require('../../utils/messages')
const User = require('../../models/schemas/User')
const {insertOne,findOneUpdate}=require('../../models/queries/commonQuery')
const {encryptData}=require('../../utils/common')
const mongoose  = require('mongoose')

const user={
    createUser:async(req,res)=>{
        try {
            const {name,email,password}=req?.body
            const encryptPassword=await encryptData(password)
            const insertData={
                name:name,
                email:email,
                password:encryptPassword,
                adminId:new mongoose.Types.ObjectId(req?.adminData?._id),
                verificationStatus:true
            }
            const user=await insertOne('User',insertData)
            return successResponse(req,res,{message:successMessages?.userCreated,data:user})
            
        } catch (error) {
            console.log(error)
            return internalError(req,res,error.message)
        }
    },

    updateUser:async(req,res)=>{
        try {
            let {name,email,id}=req?.body
            let updateData={}

            if(name){
                updateData={
                    ...updateData,
                    name:name
                }
            }

            if(email){
                updateData={
                    ...updateData,
                    email:email
                }
            }

            const updateUser=await findOneUpdate('User',{_id:new mongoose.Types.ObjectId(id)},updateData)

            if(updateUser){
                return successResponse(req,res,{message:successMessages?.success,data:updateUser})

            }else{
                return notFoundError(req,res,errorMessages?.wentWrong)
            }


        } catch (error) {
            console.log(error)
            return internalError(req,res,error?.message)
            
        }
    }
}

module.exports=user