const express = require('express');
const http = require('http');
// const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Server } = require('socket.io');
const Score = require('./models/Score.js');
const Ip = require('./funcs/ip.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async(req, res)=>{
  const ip = await Ip()
  // res.sendFile(path.join(__dirname + "/views/index.html"))
  const user = await Score.findOne({
    where: {
      ip
    }
  })

  if(user === null){
    res.sendFile(path.join(__dirname + "/views/index.html"))
  }else{
    res.redirect("/game")
  }
})
io.on("connection", (socket)=>{
  console.log("a user connected =>", socket.id)
  socket.on("disconnect", ()=>{
    console.log("user disconnected =>", socket.id)
  })
  
  socket.on("login", async(login)=>{
    const ip = await Ip()
    console.log(login)
    const findUser = await Score.findOne({
      where: {
        username: login.username,
        password: login.password
      }
    })
    console.log(findUser)
    if(findUser === null){
      await Score.create({
        username: login.username,
        password: login.password,
        ip
      })
      socket.emit("message", { message: true })
    }else{
      await Score.update({
        ip
      }, {
        where: {
          username: login.username,
          password: login.password
        }
      })
      socket.emit("message", { message: true })
    }
  })
})

app.get("/game", async(req, res)=>{
  // res.sendFile(path.join(__dirname + "/views/game.html"))
  const ip = await Ip()

  const user = await Score.findOne({
    where: {
      ip
    }
  })

  if(user === null){
    res.redirect("/")
  }else{
    res.sendFile(path.join(__dirname + "/views/game.html"))
  }
})

const players = {}

io.on("connection", (socket)=>{
  console.log("a user connected =>", socket.id)

  players[socket.id] = { id: socket.id, score: 0 };

  players[socket.id] = { id: socket.id, score: 0 }

  io.emit("scoreboardUpdate", Object.values(players))

  socket.on("updateScore", (newScore)=>{
    if(players[socket.id]){
      players[socket.id].score = newScore
      io.emit("scoreboardUpdate", Object.values(players))
    }
  })
  
  // updateScore
  // socket.on("updateScore", async(score)=>{
  //   const ip = await Ip()
  //   await Score.update({
  //     score
  //   }, {
  //     where: {
  //       ip
  //     }
  //   })
  // })

  // scoreboardUpdate
  // socket.on("scoreboardUpdate", async()=>{
  //   const scoreboard = await Score.findAll({
  //     order: [
  //       ['score', 'DESC'],
  //     ],
  //     limit: 10
  //   })
  //   io.emit("scoreboardUpdate", scoreboard)
  // })
  socket.on("disconnect", ()=>{
    console.log("user disconnected =>", socket.id)
    delete players[socket.id]
    io.emit("scoreboardUpdate", Object.values(players))
  })
})

server.listen(3000, ()=>{
  console.log("server running at http://localhost:3000")
})