const router=require('express').Router()
const {createUser,updateUser}=require('../../controller/admin/user')
const validateAdminToken=require('../../middlewares/auth/validateAdminJwtToken')

router.post('/createuser',validateAdminToken,createUser)
router.post('/updateuser',validateAdminToken,updateUser)

module.exports=router