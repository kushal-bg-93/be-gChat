const router=require('express').Router()
const {searchUser,getMyGroups}=require('../../controller/user/user')
const validateJwtToken=require('../../middlewares/auth/validateuserJwtToken')

router.get('/searchUser',validateJwtToken,searchUser)
router.get('/getGroups',validateJwtToken,getMyGroups)

module.exports=router