/**
 * Created by Administrator on 5/13/2017.
 */
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
var app = express();
const server = http.createServer(app);
var io = socketIO(server);
var port = process.env.PORT || 3000;
var moment  = require("moment");
const {User} = require("./public/users");
var user = new User();

app.use(express.static("public"))

function isreal(str){
    return typeof str === 'string' && str.trim().length > 0;
}

function generatem (admin,message){
    return {from:admin,text:message,createdat:new moment().valueOf()}
}

io.on("connection",(socket)=>{
    socket.on("disconnect",()=>{
        var use = user.removeuser(socket.id);

        if(use)
        {
            io.to(use.room).emit("updateuserlist",user.getuserlist(use.room));
            io.to(use.room).emit("newMessage",generatem("Admin",`${use.name} has left the room`));
        }

    })

    socket.on("join",(param,callback)=>{
        if(!isreal(param.name) || !isreal(param.room))
          return  callback("error");

            socket.join(param.room);
            user.removeuser(socket.id);
            user.adduser(socket.id,param.name,param.room);
            io.to(param.room).emit("updateuserlist",user.getuserlist(param.room));

            socket.emit("newMessage",generatem("Admin","welcome to chat app"));

            socket.broadcast.to(param.room).emit("newMessage",generatem("Admin",`${param.name} has joined`));


        callback()
    })

    socket.on("createMessage",(message,callback)=>{
        var use = user.getuser(socket.id);
        if(use)
        io.to(use.room).emit("newMessage",generatem(use.name,message.text));
        callback();
    })

    socket.on("createlocmessage",(coords)=>{
        var use = user.getuser(socket.id);
        if(use)
            io.to(use.room).emit("newlocmessage",generatem(use.name,(coords.latitude+","+coords.longitude)));
    })

})

server.listen(port,()=>{console.log("server started on 3000")});