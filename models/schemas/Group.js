const mongoose=require('mongoose')

const groupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        }
    ],
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'message'
    }
},{timestamps:true})

module.exports=new mongoose.model('group',groupSchema)