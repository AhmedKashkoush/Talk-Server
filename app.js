const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {createServer} = require('http')
const socketio = require('socket.io')
const server = createServer(app);
const io = socketio(server)
const {config} = require('dotenv');
const cors = require('cors')
config()
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/talkdb').then(() => {
    console.log('Database connected');
    const port = process.env.PORT || 4000
    app.listen(port,'0.0.0.0', () => {
        console.log('Server running on port:',port);
    })
    io.on('connection', socket => {
        console.log(socket.id, 'connected');
    })
    io.listen(port)
}).catch(err => {
    console.log('Database failed to connect:',err);
});
