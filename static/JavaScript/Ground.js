function Ground() {
    this.scale = 0.1;
    this.image = new Image();
    this.image.src = '/static/Textures/grass.jpg';

    this.draw = (ctx, size, xOffset, yOffset, bounds) => {
        var x = bounds.leftX;
        var y = bounds.topY;

        while (x < bounds.rightX) {
            while (y < bounds.bottomY) {
                ctx.drawImage(this.image, x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);

                y += this.scale;
            }

            y = bounds.topY;
            x += this.scale;
        }
    };
}