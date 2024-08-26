const {successMessages,errorMessages}=require('../../utils/messages')
const {notFoundError,internalError, successResponse}=require('../../utils/response')
const {findOne}=require('../../models/queries/commonQuery')
const {decryptData}=require('../../utils/common')
const {generateToken}=require('../../utils/generateToken')


const auth={
    login:async(req,res)=>{
        try {

            const {email,password,role}=req?.body
            let collection,project={},query={},token;

            if(role==='admin'){
                collection='Admin'
                project={
                    email:1,
                    password:1,
                    role:1,
                    name:1
                }
                query={email:email}
            }else {
                collection='User'
                project={
                    name:1,
                    email:1,
                    password:1,
                    adminId:1,
                    imageId:1
                }
                query={email:email,isDeleted:0,verificationStatus:true}
            }

            const user=await findOne(collection,query,project)

            if(!user) return notFoundError(req,res,errorMessages?.userDoesntExist)

            const decryptPassword=await decryptData(user?.password)
            
            if(decryptPassword!==password) return notFoundError(req,res,errorMessages?.invalidCredentials)

            token=role==='admin'?await generateToken({email:user?.email,role:user?.role,name:user?.name}):await generateToken({email:user?.email,name:user?.name,adminId:user?.adminId})


            return successResponse(req,res,{message:successMessages?.loginSuccess,token:token,role:user?.role??"user",_id:user?._id,name:user?.name,imageId:user?.imageId??"https://png.pngitem.com/pimgs/s/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"})
            
            
        } catch (error) {
            console.log('error in login -> ',error)
            return internalError(req,res,error.message)
        }
    }
}

module.exports=auth