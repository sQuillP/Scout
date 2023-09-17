export default function loadWebSockets(io) {
    io.on('connection',(socket)=> {
        socket.on('join-room',(room)=> {
            if(socket.rooms.has(room) === true) return;
            socket.join(room);
        });
    });
}  