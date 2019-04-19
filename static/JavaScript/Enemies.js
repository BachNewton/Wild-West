function Enemies() {
    this.enemies = [];
    this.enemiesForServer = [];
    this.scale = 0.07;
    this.speed = 0.002;
    this.lastSpawnTime = performance.now();
    this.timeBetweenSpawnsMs = 5000;

    this.update = (player, players, shots, stats, collisions) => {
        if (performance.now() - this.lastSpawnTime > this.timeBetweenSpawnsMs) {
            this.makeNewEnemy();
        }

        this.chasePlayers(player, players);
        stats.points += this.collisionCheck(shots, collisions);
    };

    this.collisionCheck = (shots, collisions) => {
        var points = 0;

        for (var i = 0; i < shots.shots.length; i++) {
            var shot = shots.shots[i];

            for (var j = 0; j < this.enemies.length; j++) {
                var enemy = this.enemies[j];

                var box1 = {
                    x: shot.position.x,
                    y: shot.position.y,
                    width: shots.scale,
                    height: shots.scale
                };

                var box2 = {
                    x: enemy.position.x,
                    y: enemy.position.y,
                    width: this.scale,
                    height: this.scale
                };

                if (collisions.isCollision(box1, box2)) {
                    shots.shots.splice(i, 1);
                    this.enemies.splice(j, 1);
                    i--;
                    j--;
                    points++;
                    break;
                }
            }
        }

        return points;
    };

    this.chasePlayers = (player, players) => {
        for (var enemy of this.enemies) {
            if (enemy.target in players) {
                var x = players[enemy.target].position.x;
                var y = players[enemy.target].position.y;
            } else {
                var x = player.x;
                var y = player.y;
            }

            if (enemy.position.x < x) {
                enemy.position.x += this.speed;
            } else if (enemy.position.x > x) {
                enemy.position.x -= this.speed;
            }

            if (enemy.position.y < y) {
                enemy.position.y += this.speed;
            } else if (enemy.position.y > y) {
                enemy.position.y -= this.speed;
            }
        }
    };

    this.updateServer = (socket) => {
        for (enemy of this.enemiesForServer) {
            socket.emit('new enemy', enemy.position);
        }

        this.enemiesForServer = [];
    };

    this.makeNewEnemy = () => {
        this.lastSpawnTime = performance.now();

        var position = this.getStartingPosition();

        var enemy = {
            position: position,
            target: 'you'
        };

        this.enemies.push(enemy);
        this.enemiesForServer.push(enemy);
    };

    this.makeNewEnemyFromServer = (position, target) => {
        this.enemies.push({
            position: position,
            target: target
        });
    };

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
            var x = enemy.position.x;
            var y = enemy.position.y;

            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };
}