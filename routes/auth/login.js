const router=require('express').Router();
const {login}=require('../../controller/auth/auth')

router.post('/login',login)