function Player() {
    this.x = 0;
    this.y = 0;
    this.scale = 0.05;

    this.update = (keyboard) => {
        if (keyboard.held.KeyW) {
            // 
        }
    };

    this.draw = (ctx, size) => {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.scale * size, this.scale * size);
    };
}