function Networking() {
    this.socket = io();

    this.socket.emit('new player');
}