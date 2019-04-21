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
    this.state = 0;
    this.STATE = {
        IDLE_E: 0,
        WALKING_E: 1,
        IDLE_S: 2,
        WALKING_S: 3,
        IDLE_W: 4,
        WALKING_W: 5,
        IDLE_N: 6,
        WALKING_N: 7,
        IDLE_NE: 8,
        WALKING_NE: 9,
        IDLE_SE: 10,
        WALKING_SE: 11,
        IDLE_SW: 12,
        WALKING_SW: 13,
        IDLE_NW: 14,
        WALKING_NW: 15
    };
    this.spriteManager = new SpriteManager({
        imageSrc: '/static/Textures/cowboy.png',
        width: 128,
        height: 128,
        speedMs: 150
    });

    this.playState = () => {
        switch (this.state) {
            case this.STATE.IDLE_E:
                return this.spriteManager.playState(0, 0 * this.spriteManager.height, 1);
            case this.STATE.WALKING_E:
                return this.spriteManager.playState(0, 0 * this.spriteManager.height, 8);
            case this.STATE.IDLE_S:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 1);
            case this.STATE.WALKING_S:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 8);
            case this.STATE.IDLE_W:
                return this.spriteManager.playState(0, 7 * this.spriteManager.height, 1);
            case this.STATE.WALKING_W:
                return this.spriteManager.playState(0, 7 * this.spriteManager.height, 8);
            case this.STATE.IDLE_N:
                return this.spriteManager.playState(0, 5 * this.spriteManager.height, 1);
            case this.STATE.WALKING_N:
                return this.spriteManager.playState(0, 5 * this.spriteManager.height, 8);
            case this.STATE.IDLE_NE:
                return this.spriteManager.playState(0, 4 * this.spriteManager.height, 1);
            case this.STATE.WALKING_NE:
                return this.spriteManager.playState(0, 4 * this.spriteManager.height, 8);
            case this.STATE.IDLE_SE:
                return this.spriteManager.playState(0, 2 * this.spriteManager.height, 1);
            case this.STATE.WALKING_SE:
                return this.spriteManager.playState(0, 2 * this.spriteManager.height, 8);
            case this.STATE.IDLE_SW:
                return this.spriteManager.playState(0, 8 * this.spriteManager.height, 1);
            case this.STATE.WALKING_SW:
                return this.spriteManager.playState(0, 8 * this.spriteManager.height, 8);
            case this.STATE.IDLE_NW:
                return this.spriteManager.playState(0, 6 * this.spriteManager.height, 1);
            case this.STATE.WALKING_NW:
                return this.spriteManager.playState(0, 6 * this.spriteManager.height, 8);
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
            angle = angle * (180 / Math.PI) + 180;
        }

        if (angle === null) {
            if (this.state % 2 !== 0) {
                var newState = this.state - 1;
            } else {
                var newState = this.state;
            }
        } else {
            var newState = this.degreeToState(angle);
        }

        if (newState !== this.state) {
            this.state = newState;
            this.playState();
        }
    };

    this.degreeToState = (degree) => {
        var states = [
            this.STATE.WALKING_W,
            this.STATE.WALKING_NW,
            this.STATE.WALKING_N,
            this.STATE.WALKING_NE,
            this.STATE.WALKING_E,
            this.STATE.WALKING_SE,
            this.STATE.WALKING_S,
            this.STATE.WALKING_SW
        ];

        return states[(Math.floor(degree / 45) % 8)];
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
        this.spriteManager.draw(ctx, this.x * size + xOffset, this.y * size + yOffset);
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