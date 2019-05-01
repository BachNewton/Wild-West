function Ground() {
    this.STARTING_X = -0.5;
    this.STARTING_Y = -0.5;
    this.TILES_X = 20;
    this.TILES_Y = 20;
    this.scale = 0.1;
    this.image = new Image();
    this.image.src = '/static/Textures/grass.jpg';

    this.draw = (ctx, size, xOffset, yOffset) => {
        for (var i = 0; i < this.TILES_X; i++) {
            for (var j = 0; j < this.TILES_Y; j++) {
                var x = this.STARTING_X + (this.scale * i);
                var y = this.STARTING_Y + (this.scale * j);

                ctx.drawImage(this.image, x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
            }
        }
    };
}