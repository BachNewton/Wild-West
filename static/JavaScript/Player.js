function Player() {
    this.speed = 0.01;
    this.scale = 0.05;
    this.x = 0.5 - this.scale / 2;
    this.y = 0.5 - this.scale / 2;
    this.canFire = true;
    this.lives = 3;
    this.isInvincible = false;
    this.invincibilityCooldownMs = 1000;
    this.fireSpeed = 0.02;
    this.fireCooldownMs = 300;
    this.deadZone = 0.3;

    this.update = (movementVector, aimVector, shots, enemies, collisions) => {
        if (this.lives > 0) {
            this.updateMovement(movementVector);
            this.updateFiring(aimVector, shots);
            this.collisionCheck(enemies, collisions);
        }
    }

    this.updateMovement = (movementVector) => {
        this.x += this.speed * movementVector.x;
        this.y += this.speed * movementVector.y;

        this.x = Math.max(0, this.x);
        this.y = Math.max(0, this.y);

        if (this.x + this.scale > 1) {
            this.x = 1 - this.scale;
        }
        if (this.y + this.scale > 1) {
            this.y = 1 - this.scale;
        }
    };

    this.updateFiring = (aimVector, shots) => {
        if (this.canFire && this.isIntendingToFire(aimVector)) {
            this.canFire = false;
            setTimeout(() => { this.canFire = true; }, this.fireCooldownMs);

            var position = {
                x: this.x + 0.5 * (this.scale - shots.scale),
                y: this.y + 0.5 * (this.scale - shots.scale)
            };

            var angle = Math.atan2(aimVector.y, aimVector.x);

            var velocity = {
                x: this.fireSpeed * Math.cos(angle),
                y: this.fireSpeed * Math.sin(angle)
            };

            shots.add(position, velocity);
        }
    };

    this.collisionCheck = (enemies, collisions) => {
        if (this.isInvincible) {
            return;
        }

        for (var i = 0; i < enemies.enemies.length; i++) {
            var enemy = enemies.enemies[i];

            var box1 = {
                x: this.x,
                y: this.y,
                width: this.scale,
                height: this.scale
            };

            var box2 = {
                x: enemy.position.x,
                y: enemy.position.y,
                width: enemies.getScale(enemy.type),
                height: enemies.getScale(enemy.type)
            };

            if (collisions.isCollision(box1, box2)) {
                this.lives--;
                this.isInvincible = true;
                setTimeout(() => { this.isInvincible = false; }, this.invincibilityCooldownMs);
                return;
            }
        }
    };

    this.isIntendingToFire = (aimVector) => {
        return Math.abs(aimVector.x) > this.deadZone || Math.abs(aimVector.y) > this.deadZone;
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        if (this.lives <= 0) {
            ctx.fillStyle = 'grey';
        } else if (this.isInvincible) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'orange';
        }

        ctx.fillRect(this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
    };

    this.updateServer = (socket) => {
        socket.emit('player update', {
            x: this.x,
            y: this.y,
            isInvincible: this.isInvincible,
            lives: this.lives
        });
    };
}