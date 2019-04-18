function Shots() {
    this.shots = [];
    this.scale = 0.015;

    this.add = (position, velocity) => {
        this.shots.push({
            position: position,
            velocity: velocity
        });
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'red';

        for (var shot of this.shots) {
            var x = shot.position.x;
            var y = shot.position.y;

            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };

    this.update = (size) => {
        for (var i = 0; i < this.shots.length; i++) {
            var shot = this.shots[i];

            shot.position.x += size * shot.velocity.x;
            shot.position.y += size * shot.velocity.y;

            if (shot.position.x + this.scale < 0 || shot.position.x > 1 || shot.position.y + this.scale < 0 || shot.position.y > 1) {
                this.shots.splice(i, 1);
                i--;
            }
        }
    };
}