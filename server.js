const express=require('express')
const app=express();
const cors=require('cors')
const mongoose = require('mongoose')
const helmet=require('helmet')
const path=require('path')
const routes=require('./routes/index-route')

app.use(cors())



require('dotenv').config()

app.use(express.static(path.join(__dirname,'public')))
// app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// console.log(__dirname)

app.use(routes)

mongoose.set('debug',true)

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log(`DB gchat connected`)
}).catch((err)=>console.log('error in mongoose : ',err))

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is up and running on port ${process.env.PORT}`)
})

    const io=require('./socket').init(server)
    // const io=require('socket.io')(server)

    io.on('connection',socket=>{
        console.log('Client connected')

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        
            // Notify room members
            socket.to(roomId).emit('message', 'A new user has joined the room');
          });

          socket.on('chatMessage', (data, roomId) => {
            socket.to(roomId).emit('receive message', data);
          });
        
        socket.on('disconnect', () => {
            console.log('A user disconnected');
          });

          

        
    })

