function Player() {
    this.speed = 0.01;
    this.scale = 0.1;
    this.x = 0.5 - this.scale / 2;
    this.y = 0.5 - this.scale / 2;
    this.canFire = true;
    this.lives = 3;
    this.isInvincible = false;
    this.invincibilityCooldownMs = 1000;
    this.fireSpeed = 0.02;
    this.fireCooldownMs = 300;
    this.deadZone = 0.3;
    this.state = 0;
    this.STATE = {
        IDLE_E: 0,
        WALKING_E: 1,
        IDLE_S: 2,
        WALKING_S: 3,
        IDLE_W: 4,
        WALKING_W: 5,
        IDLE_N: 6,
        WALKING_N: 7
    };
    this.spriteManager = new SpriteManager({
        imageSrc: '/static/Textures/player.png',
        width: 64,
        height: 64,
        marginX: 5,
        marginTop: 10,
        marginBottom: 0,
        speedMs: 100
    });

    this.playState = () => {
        switch (this.state) {
            case this.STATE.IDLE_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 1);
            case this.STATE.WALKING_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 9);
            case this.STATE.IDLE_S:
                return this.spriteManager.playState(0, 10 * this.spriteManager.height, 1);
            case this.STATE.WALKING_S:
                return this.spriteManager.playState(64, 10 * this.spriteManager.height, 8);
            case this.STATE.IDLE_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 1);
            case this.STATE.WALKING_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 9);
            case this.STATE.IDLE_N:
                return this.spriteManager.playState(0, 8 * this.spriteManager.height, 1);
            case this.STATE.WALKING_N:
                return this.spriteManager.playState(64, 8 * this.spriteManager.height, 8);
        }
    };

    this.restart = () => {
        this.x = 0.5 - this.scale / 2;
        this.y = 0.5 - this.scale / 2;
        this.lives = 3;
    };

    this.getCenter = () => {
        return {
            x: this.x + this.scale / 2,
            y: this.y + this.scale / 2
        };
    };

    this.update = (movementVector, aimVector, shots, enemies, collisions) => {
        if (this.lives > 0) {
            this.updateMovement(movementVector);
            this.updateFiring(aimVector, shots);
            this.collisionCheck(enemies, collisions);
        }
    };

    this.updateMovement = (movementVector) => {
        this.x += this.speed * movementVector.x;
        this.y += this.speed * movementVector.y;

        this.boundPlayerPosition();
        this.updateState(movementVector);
    };

    this.boundPlayerPosition = () => {
        this.x = Math.max(0, this.x);
        this.y = Math.max(0, this.y);

        if (this.x + this.scale > 1) {
            this.x = 1 - this.scale;
        }
        if (this.y + this.scale > 1) {
            this.y = 1 - this.scale;
        }
    };

    this.updateState = (movementVector) => {
        if (movementVector.x === 0 && movementVector.y === 0) {
            var angle = null;
        } else {
            var angle = Math.atan2(movementVector.y, movementVector.x);
        }

        if (angle === null) {
            if (this.state % 2 !== 0) {
                var newState = this.state - 1;
            } else {
                var newState = this.state;
            }
        } else {
            var newState = this.angleToState(angle);
        }

        if (newState !== this.state) {
            this.state = newState;
            this.playState();
        }
    };

    this.angleToState = (angle) => {
        angle = angle * (180 / Math.PI) + 180;

        var states = [
            this.STATE.WALKING_W,
            this.STATE.WALKING_W,
            this.STATE.WALKING_N,
            this.STATE.WALKING_E,
            this.STATE.WALKING_E,
            this.STATE.WALKING_E,
            this.STATE.WALKING_S,
            this.STATE.WALKING_W
        ];

        return states[(Math.floor(angle / 45 + 0.5) % 8)];
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
        this.spriteManager.draw(ctx, this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
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