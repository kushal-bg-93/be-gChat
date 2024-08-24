const router=require('express').Router()
const {createGroup,sendMessage,addMember,removeMember,likeMessage,getMessages}=require('../../controller/user/group')
const validateJwtToken=require('../../middlewares/auth/validateuserJwtToken')

router.post('/createGroup',validateJwtToken,createGroup)
router.post('/sendMessage',validateJwtToken,sendMessage)
router.post('/addMembers',validateJwtToken,addMember)
router.post('/removeMember',validateJwtToken,removeMember)
router.post('/likeMessage',validateJwtToken,likeMessage)
router.get('/getMessages/:id',validateJwtToken,getMessages)
module.exports=router