const { match } = require('assert');
const express = require('express')
const http = require('http')
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app)
const io = socketIo(server);

app.use(express.static(parth.join(__dirname, 'public')));

const players = {}


io.on('connection', (socket) => {
    console.log(`Um jogador entrou..`);


    players[socket.id] = {
        x: 100,
        y: 100,
        color: getRandomColor()
    };

    socket.emit('init', players);

    socket.on('move', (direction) => {
        const player = players[socket.id];
        switch (direction) {
            case 'up':
                player.y -= 10;
                break;
            case 'down':
                player.y += 10;
                break;
            case 'left':
                player.x -= 10;
                break;
            case 'right':
                player.x += 10
                break;
        }
        io.emit('update', players);
    });
    // Remover o jogador quando ele desconecta
    socket.on('disconnect', () => {
        console.log(`Um jogador saiu..`);
        delete players[socket.id];
        io.emit('update', players);
    });
});


const getRandomColor = () => {
    const letters = '0123456789ABCDF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando da PORTA: ${PORT}`);
});
