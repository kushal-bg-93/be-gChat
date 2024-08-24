const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'group'
    },
    likeCount:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports=mongoose.model("message",messageSchema)