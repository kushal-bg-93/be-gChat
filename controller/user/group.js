const {notFoundError,internalError, successResponse}=require('../../utils/response')
const {successMessages,errorMessages}=require('../../utils/messages')
const {insertOne,findOne,updateOne,findOneUpdatePush,findOneUpdatePull,findOneUpdateIncrement}=require('../../models/queries/commonQuery')
const mongoose  = require('mongoose')
const Message=require('../../models/schemas/Message')
const socket=require('../../socket')


const group={
    createGroup:async(req,res)=>{
        try {
            let {name,users}=req?.body
            users.push(req?.userData?._id)
            const insertData={
                name:name,
                users:users,
                adminId:req?.userData?._id,

            }

            const insertGroup=await insertOne('Group',insertData)

            return successResponse(req,res,{message:successMessages?.success,data:insertGroup})

        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
        }
    },
    sendMessage:async(req,res)=>{
        try {
            const {groupId,content}=req?.body
            const findExistUser=await findOne('Group',{_id:new mongoose.Types.ObjectId(groupId),users:req?.userData?._id},{_id:1})

            console.log('This is existing user',findExistUser)

            if(!findExistUser?._id){
                return notFoundError(req,res,errorMessages?.unauthorisedAccess)
            }
            const insertData={
                content:content,
                groupId:new mongoose.Types.ObjectId(groupId),
                senderId:new mongoose.Types.ObjectId(req?.userData?._id)
            
            }
            let insertMsg=await Message.create(insertData)
            // await insertMsg.save()
            console.log('condition check',String(req?.userData?.Id))
            await insertMsg.populate('senderId');
            
            if(String(req?.userData?._id)==String(insertMsg?.senderId?._id)){
                insertMsg=insertMsg._doc
                insertMsg={...insertMsg,senderStatus:true,userData:insertMsg.senderId,senderId:insertMsg.senderId._id}
            }
            // await insertMsg.populate('groupId')


            const updateLatest=await updateOne('Group',{_id:new mongoose.Types.ObjectId(groupId)},{latestMessage:insertMsg?._id})

            return successResponse(req,res,{message:successMessages?.success,data:insertMsg})

        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error?.message)
        }
    },
    addMember:async(req,res)=>{
        try {
            const {users,groupId}=req?.body 

            const findAdmin=await findOne('Group',{_id:new mongoose.Types.ObjectId(groupId),adminId:new mongoose.Types.ObjectId(req?.userData?._id)},{_id:1})

            if(!findAdmin?._id) return notFoundError(req,res,errorMessages?.unauthorisedAccess)

            const addMember=await findOneUpdatePush('Group',{_id:new mongoose.Types.ObjectId(groupId),users:{$nin:users}},{users:users})

            if(!addMember) return notFoundError(req,res,errorMessages?.userExists)

            return successResponse(req,res,{message:successMessages?.success,data:addMember})
        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
            
        }
    },
    removeMember:async(req,res)=>{
        try {
            const {userId,groupId}=req?.body 

            const findAdmin=await findOne('Group',{_id:new mongoose.Types.ObjectId(groupId),adminId:new mongoose.Types.ObjectId(req?.userData?._id)},{_id:1})

            if(!findAdmin?._id) return notFoundError(req,res,errorMessages?.unauthorisedAccess)

            const removeMember=await findOneUpdatePull('Group',{_id:new mongoose.Types.ObjectId(groupId)},{users:userId})

            return successResponse(req,res,{message:successMessages?.success,data:removeMember})
        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
            
        }
    },
    likeMessage:async(req,res)=>{
        try {
            const {messageId}=req?.body
            const checkLiked=await findOne('Like',{likedBy:new mongoose.Types.ObjectId(req?.userData?._id),messageId:new mongoose.Types.ObjectId(messageId)},{_id:1})

            if(checkLiked?._id) return notFoundError(req,res,errorMessages?.alreadyLiked)

            const message=await findOne('Message',{_id:new mongoose.Types.ObjectId(messageId)},{groupId:1})

            await message.populate({path:'groupId',select:'users'})

            const {users}=message?.groupId

            if(!users.some(id=>String(id)==String(req?.userData?._id))) return notFoundError(req,res,errorMessages?.unauthorisedAccess)

            const likeUpdateMessage=await findOneUpdateIncrement("Message",{_id:new mongoose.Types.ObjectId(messageId)},{likeCount:1})

            const likeUpdate=await insertOne('Like',{likedBy:new mongoose.Types.ObjectId(req?.userData?._id),messageId:messageId})

            return successResponse(req,res,{message:successMessages?.success,data:likeUpdate})

        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
            
        }
    },
    getMessages:async(req,res)=>{
        try {
            const groupId=req?.params?.id;
            const{pageNo}=req?.query;
            const limit=10;
            let skip=(pageNo-1)*limit
            const getMessages=await Message.aggregate([
                {
                    $match:{
                        groupId:new mongoose.Types.ObjectId(groupId)
                    }
                    
                },
                {
                    $sort:{
                        createdAt:-1
                    }
                },
                {
                    $skip:skip
                },
                {
                    $limit:limit
                },
                {
                    $project:{
                        _id:1,
                        content:1,
                        senderId:1,
                        senderStatus:{
                            $cond:{
                                if:{$eq:['$senderId',new mongoose.Types.ObjectId(req?.userData?._id)]},
                                then:true,
                                else:false
                            }
                        },
                        likeCount:1,
                        createdAt:1
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'senderId',
                        foreignField:'_id',
                        pipeline:[
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                    imageId:1,
                                    adminId:1
                            }
                        }
                        ],
                        as:'userData'
                    }
                },
                {
                    $unwind:{
                        path:'$userData'
                    }
                },
                {
                    $lookup:{
                        from:'likes',
                        localField:'_id',
                        foreignField:'messageId',
                        pipeline:[
                            {
                                $match:{
                                    'likedBy':new mongoose.Types.ObjectId(req?.userData?._id)
                                }
                            },
                            {
                                $project:{
                                    messageId:1,
                                    likedBy:1
                                }
                            }
                        ],
                        as:'likeData'
                    }
                },
                {
                    $unwind:{
                        path:'$likeData',
                        preserveNullAndEmptyArrays:true
                    }
                },
                {
                    $sort:{
                        createdAt:1
                    }
                },              
                {
                    $project:{
                        _id:1,
                        content:1,
                        senderId:1,
                        senderStatus:1,
                        likeData:1,
                        likeCount:1,
                        userData:1,
                        createdAt:1
                        // likeStatus:{
                        //     $cond:{
                        //         if:{$eq:['']}
                        //     }
                        // }
                    }
                }
            ])

            const totalDocs=await Message.countDocuments({groupId:new mongoose.Types.ObjectId(groupId)})

            // res.json(getMessages)
            return successResponse(req,res,{message:successMessages?.success,data:getMessages,pageData:{total:totalDocs,pageSize:limit,skip:skip}})
        } catch (error) {
            console.log(error.message)
            return internalError(req,res,error.message)
        }
    }
}

module.exports=group