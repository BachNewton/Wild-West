function Enemies() {
    this.enemies = [];
    this.scale = 0.07;
    this.speed = 0.002;
    this.lastSpawnTime = performance.now();
    this.timeBetweenSpawnsMs = 5000;

    this.update = (player) => {
        if (performance.now() - this.lastSpawnTime > this.timeBetweenSpawnsMs) {
            this.lastSpawnTime = performance.now();

            var position = this.getStartingPosition();

            this.enemies.push({
                x: position.x,
                y: position.y
            });
        }

        for (var enemy of this.enemies) {
            if (enemy.x < player.x) {
                enemy.x += this.speed;
            } else if (enemy.x > player.x) {
                enemy.x -= this.speed;
            }

            if (enemy.y < player.y) {
                enemy.y += this.speed;
            } else if (enemy.y > player.y) {
                enemy.y -= this.speed;
            }
        }
    }

    this.getStartingPosition = () => {
        var position = {};

        if (Math.random() < 0.5) {
            position.x = -0.5;
        } else {
            position.x = 1.5;
        }

        if (Math.random() < 0.5) {
            position.y = -0.5;
        } else {
            position.y = 1.5;
        }

        return position;
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'green';

        for (var enemy of this.enemies) {
            var x = enemy.x;
            var y = enemy.y;

            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };
}