const {successMessages,errorMessages}=require('../../utils/messages')
const {notFoundError,internalError}=require('../../utils/response')
const {findOne}=require('../../models/queries/commonQuery')
const {decryptData}=require('../../utils/common')
const {generateToken}=require('../../utils/generateToken')


const auth={
    login:async(req,res)=>{
        try {

            const {email,password,role}=req?.body
            let collection,project={},query={}

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
                    adminId:1
                }
                query={email:email,isDeleted:0,verificationStatus:true}
            }
            
        } catch (error) {
            console.log('error in login -> ',error)
            return internalError(req,res,error.message)
        }
    }
}

module.exports=auth