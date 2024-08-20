const jwt=require("jsonwebtoken")

const generateToken=async(data)=>{

    try {
        
        const token=await jwt.sign({userData:data},process.env.JWT_SECRET,{expiresIn:'30d'})
        return {status:true,token:token};
    } catch (error) {
        console.log(error)
        return {status:false,error:error}
    }
}

const verifyToken=async(token)=>{
    try {
        const data=await jwt.verify(token,process.env.JWT_SECRET)

        return {status:true,data:data}
        
    } catch (error) {
        return {status:false,error:error}
    }

}

module.exports={generateToken,verifyToken}