function OtherPlayers() {
    this.players = {};
    this.scale = 0.05;

    this.update = (id, data) => {
        if (id in this.players) {
            this.players[id].position = { x: data.x, y: data.y };
            this.players[id].isInvincible = data.isInvincible;
            this.players[id].lives = data.lives;
        } else {
            this.players[id] = {};
            this.update(id, data);
        }
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        for (var id in this.players) {
            var player = this.players[id];

            var x = player.position.x;
            var y = player.position.y;

            if (player.lives <= 0) {
                ctx.fillStyle = 'grey';
            } else if (player.isInvincible) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'blue';
            }

            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };

    this.remove = (id) => {
        delete this.players[id];
    };
}