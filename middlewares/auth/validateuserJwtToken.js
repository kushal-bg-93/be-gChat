const { verifyToken } = require("../../utils/generateToken")
const { notFoundError } = require("../../utils/response")
const { successMessages, errorMessages } = require("../../utils/messages")

const {findOne}=require('../../models/queries/commonQuery')

const validateToken = async (req, res, next) => {

    if (!req?.headers?.authorization)return notFoundError(req, res, errorMessages?.tokenRequired)

    const extractedData = await verifyToken(req?.headers?.authorization)

    console.log('this is extractedData',extractedData)

    

    if (!extractedData?.status) return notFoundError(req, res, errorMessages?.wentWrong)
    
        const {adminId,name,email}=extractedData?.data?.userData

    if(!adminId) return notFoundError(req,res,errorMessages?.unauthorisedAccess)

    // res.send(extractedData)

    const findUser = await findOne('User',{email:email,isDeleted:0,verificationStatus:true},{email:1,name:1,adminId:1})


    if (!findUser) return notFoundError(req, res, errorMessages?.userDoesntExist)

    req.userData = {
        _id:findUser?._id,
        email: findUser?.email,
        adminId: findUser?.adminId,
        name:findUser?.name
    }

    next();
}

module.exports = validateToken