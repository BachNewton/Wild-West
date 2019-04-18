function Player() {
    this.x = 0;
    this.y = 0;
    this.speed = 0.00001;
    this.scale = 0.05;

    this.update = (keyboard, size) => {
        if (keyboard.held.KeyW) {
            this.y -= size * this.speed;
        }
        if (keyboard.held.KeyA) {
            this.x -= size * this.speed;
        }
        if (keyboard.held.KeyS) {
            this.y += size * this.speed;
        }
        if (keyboard.held.KeyD) {
            this.x += size * this.speed;
        }

        this.x = Math.max(0, this.x);
        this.y = Math.max(0, this.y);

        if (this.x + this.scale > 1) {
            this.x = 1 - this.scale;
        }
        if (this.y + this.scale > 1) {
            this.y = 1 - this.scale;
        }
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
    };

    this.updateServer = (socket) => {
        socket.emit('player update', { x: this.x, y: this.y });
    };
}