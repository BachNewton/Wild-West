function Player() {
    this.speed = 0.01;
    this.scale = 0.1;
    this.x = 0.5 - this.scale / 2;
    this.y = 0.5 - this.scale / 2;
    this.canFire = true;
    this.ammo = 50;
    this.lives = 3;
    this.isInvincible = false;
    this.invincibilityCooldownMs = 1500;
    this.flashingIntervalMs = 100;
    this.drawPlayer = true;
    this.fireSpeed = 0.02;
    this.fireCooldownMs = 150;
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
        DEAD: 8
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
    this.playersToRevive = [];

    this.playState = () => {
        switch (this.state) {
            case this.STATE.IDLE_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 9, true);
            case this.STATE.IDLE_S:
                return this.spriteManager.playState(0, 10 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_S:
                return this.spriteManager.playState(64, 10 * this.spriteManager.height, 8, true);
            case this.STATE.IDLE_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 9, true);
            case this.STATE.IDLE_N:
                return this.spriteManager.playState(0, 8 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_N:
                return this.spriteManager.playState(64, 8 * this.spriteManager.height, 8, true);
            case this.STATE.DEAD:
                return this.spriteManager.playState(0, 20 * this.spriteManager.height, 6, false);
        }
    };

    this.restart = () => {
        this.x = 0.5 - this.scale / 2;
        this.y = 0.5 - this.scale / 2;
        this.lives = 3;
        this.ammo = 50;
        this.state = 0;
        this.playState();
    };

    this.getCenter = () => {
        return {
            x: this.x + this.scale / 2,
            y: this.y + this.scale / 2
        };
    };

    this.update = (movementVector, aimVector, reviveAttempt, otherPlayers, shots, enemies, collisions, bounds) => {
        if (this.lives > 0) {
            this.updateMovement(movementVector, bounds);
            this.updateFiring(aimVector, shots);
            this.collisionCheck(enemies, collisions);

            if (reviveAttempt) {
                this.attemptToRevive(otherPlayers, collisions);
            }
        } else {
            if (this.state !== this.STATE.DEAD) {
                this.state = this.STATE.DEAD;
                this.playState();
            }
        }
    };

    this.attemptToRevive = (otherPlayers, collisions) => {
        var box1 = {
            x: this.x,
            y: this.y,
            width: this.scale,
            height: this.scale
        };

        for (var id in otherPlayers.players) {
            var otherPlayer = otherPlayers.players[id];

            if (otherPlayer.lives <= 0) {
                var box2 = {
                    x: otherPlayer.position.x,
                    y: otherPlayer.position.y,
                    width: otherPlayers.scale,
                    height: otherPlayers.scale
                };

                if (collisions.isCollision(box1, box2)) {
                    this.playersToRevive.push(id);
                }
            }
        }
    };

    this.revive = () => {
        this.lives = 1;
        this.state = 0;
        this.playState();
    };

    this.updateMovement = (movementVector, bounds) => {
        this.x += this.speed * movementVector.x;
        this.y += this.speed * movementVector.y;

        this.boundPlayerPosition(bounds);
        this.updateState(movementVector);
    };

    this.boundPlayerPosition = (bounds) => {
        this.x = Math.max(bounds.leftX, this.x);
        this.y = Math.max(bounds.topY, this.y);

        if (this.x + this.scale > bounds.rightX) {
            this.x = bounds.rightX - this.scale;
        }

        if (this.y + this.scale > bounds.bottomY) {
            this.y = bounds.bottomY - this.scale;
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
        if (this.canFire && this.ammo > 0 && this.isIntendingToFire(aimVector)) {
            this.canFire = false;
            setTimeout(() => { this.canFire = true; }, this.fireCooldownMs);

            this.ammo--;

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

        var box1 = {
            x: this.x,
            y: this.y,
            width: this.scale,
            height: this.scale
        };

        for (var i = 0; i < enemies.enemies.length; i++) {
            var enemy = enemies.enemies[i];

            var box2 = {
                x: enemy.position.x,
                y: enemy.position.y,
                width: enemies.getScale(enemy.type),
                height: enemies.getScale(enemy.type)
            };

            if (collisions.isCollision(box1, box2)) {
                this.lives--;
                this.isInvincible = true;
                var intervalId = setInterval(() => {
                    this.drawPlayer = this.lives > 0 ? !this.drawPlayer : true;
                }, this.flashingIntervalMs);
                setTimeout(() => {
                    this.isInvincible = false;
                    this.drawPlayer = true;
                    clearInterval(intervalId);
                }, this.invincibilityCooldownMs);
                return;
            }
        }
    };

    this.isIntendingToFire = (aimVector) => {
        return Math.abs(aimVector.x) > this.deadZone || Math.abs(aimVector.y) > this.deadZone;
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        if (this.drawPlayer) {
            this.spriteManager.draw(ctx, this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
        }
    };

    this.updateServer = (socket) => {
        socket.emit('player update', {
            x: this.x,
            y: this.y,
            lives: this.lives,
            state: this.state,
            drawPlayer: this.drawPlayer
        });

        for (var id of this.playersToRevive) {
            socket.emit('revive player', id);
        }

        this.playersToRevive = [];
    };
}