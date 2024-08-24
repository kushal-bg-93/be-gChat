const mongoose=require('mongoose')

const likeSchema=new mongoose.Schema({
    messageId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'message'
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{timestamps:true})

module.exports=new mongoose.model('like',likeSchema)