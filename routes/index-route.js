const express=require('express')
const app=express()

const main='/app/v1'

app.use(main+'/auth',require('./auth/login'))
app.use(main+'/admin',require('./admin/user'))
app.use(main+'/user',require('./user/user'))
app.use(main+'/user/group',require('./user/group'))

app.use((req,res)=>{
    res.send("400 Not Found")
})

module.exports=app