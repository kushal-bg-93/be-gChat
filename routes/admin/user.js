const router=require('express').Router()
const {createUser,updateUser,viewUser}=require('../../controller/admin/user')
const validateAdminToken=require('../../middlewares/auth/validateAdminJwtToken')

router.post('/createuser',validateAdminToken,createUser)
router.post('/updateuser',validateAdminToken,updateUser)
router.get('/viewUsers',validateAdminToken,viewUser)

module.exports=router