function OtherPlayers() {
    this.players = {};
    this.scale = 0.05;

    this.update = (id, position) => {
        if (id in this.players) {
            this.players[id].position = position;
        } else {
            this.players[id] = {};
            this.update(id, position);
        }
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        for (var id in this.players) {
            var x = this.players[id].position.x;
            var y = this.players[id].position.y;

            ctx.fillStyle = 'blue';
            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };
}