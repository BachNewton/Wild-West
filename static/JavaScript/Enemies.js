function Enemies() {
    this.enemies = [];
    this.enemiesForServer = [];
    this.TYPE = {
        SMALL: 0,
        MEDIUM: 1,
        LARGE: 2
    };
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
                    width: this.getScale(enemy.type),
                    height: this.getScale(enemy.type)
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

    this.getScale = (type) => {
        switch (type) {
            case this.TYPE.SMALL:
                return 0.035;
            case this.TYPE.MEDIUM:
                return 0.07;
            case this.TYPE.LARGE:
                return 0.14;
        }

        return 0;
    };

    this.chasePlayers = (player, players) => {
        for (var enemy of this.enemies) {
            if (enemy.target in players) {
                var x = players[enemy.target].position.x;
                var y = players[enemy.target].position.y;
            } else {
                // Warning: This logic can desynch enemies on the server
                var x = player.x;
                var y = player.y;
            }

            var speed = this.getSpeed(enemy.type);

            if (enemy.position.x < x) {
                enemy.position.x += speed;
            } else if (enemy.position.x > x) {
                enemy.position.x -= speed;
            }

            if (enemy.position.y < y) {
                enemy.position.y += speed;
            } else if (enemy.position.y > y) {
                enemy.position.y -= speed;
            }
        }
    };

    this.getSpeed = (type) => {
        switch (type) {
            case this.TYPE.SMALL:
                return 0.004;
            case this.TYPE.MEDIUM:
                return 0.002;
            case this.TYPE.LARGE:
                return 0.001;
        }

        return 0;
    };

    this.updateServer = (socket) => {
        for (enemy of this.enemiesForServer) {
            socket.emit('new enemy', enemy.position, enemy.type);
        }

        this.enemiesForServer = [];
    };

    this.makeNewEnemy = () => {
        this.lastSpawnTime = performance.now();

        var position = this.getStartingPosition();

        var enemy = {
            position: position,
            target: 'you',
            type: this.getRandomType()
        };

        this.enemies.push(enemy);
        this.enemiesForServer.push(enemy);
    };

    this.getRandomType = () => {
        return Math.floor(Math.random() * Object.keys(this.TYPE).length);
    };

    this.makeNewEnemyFromServer = (position, target, type) => {
        this.enemies.push({
            position: position,
            target: target,
            type: type
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
        for (var enemy of this.enemies) {
            var x = enemy.position.x;
            var y = enemy.position.y;

            ctx.fillStyle = this.getColor(enemy.type);
            var scale = this.getScale(enemy.type);
            ctx.fillRect(x * size + xOffset, y * size + yOffset, scale * size, scale * size);
        }
    };

    this.getColor = (type) => {
        switch (type) {
            case this.TYPE.SMALL:
                return 'magenta';
            case this.TYPE.MEDIUM:
                return 'green';
            case this.TYPE.LARGE:
                return 'cyan';
        }

        return 'black';
    };
}