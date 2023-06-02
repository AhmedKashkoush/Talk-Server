const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { createServer } = require('http')
const socketio = require('socket.io')
const server = createServer(app)
const io = socketio(server)
const { config } = require('dotenv')
const path = require('path')
const cors = require('cors')
const api = require('./routes/api')
const logger = require('./middleware/logger')

config()
app.use(cors())

const sockets = {}

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(logger)

mongoose
  .connect('mongodb://127.0.0.1:27017/talkdb')
  .then(() => {
    console.log('Database connected')
    const port = process.env.PORT || 4000
    app.use('/v1/api', api)
    // app.listen(port,'0.0.0.0', () => {
    //     console.log('Server running on port:',port);
    // })
    io.on('connection', socket => {
      console.log(socket.id, 'connected')
      socket.on('connected', data => {
        const { email } = data
        sockets[email] = socket.id
        console.log(`client: ${socket.id} connected`)
        console.log('pool:', sockets)
      })
      socket.on('message', data => {
        // console.log(socket.id, 'emitted:', data)
        const { from, to, text, createdAt } = data
        console.log(sockets[to])
        io.to(sockets[to]).emit('message', { from, to, text, createdAt })
        // io.to(sockets[to]).emit('message',{from,text})
      })
      socket.on('disconnect', () => {
        console.log(
          Object.keys(sockets).find(key => sockets[key] === socket.id)
        )
        delete sockets[
          Object.keys(sockets).find(key => sockets[key] === socket.id)
        ]
        console.log(`client: ${socket.id} disconnected`)
        console.log('pool:', sockets)
      })
    })
    server.listen(port, '0.0.0.0', () => {
      console.log('Server running on port:', port)
    })
    // io.listen(port)
  })
  .catch(err => {
    console.log('Database failed to connect:', err)
  })
