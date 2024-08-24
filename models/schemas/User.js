const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    imageId:{
        type:String,
        default:"https://png.pngitem.com/pimgs/s/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'admin'
    },
    verificationStatus:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Number,
        enum:[0,1],
        default:0
    }
},{timestamps:true})

module.exports=new mongoose.model('user',userSchema)