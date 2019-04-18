function Player() {
    this.x = 0;
    this.y = 0;
    this.speed = 0.005;
    this.scale = 0.05;
    this.canFire = true;
    this.fireCooldownMs = 300;

    this.update = (keyboard, shots) => {
        if (keyboard.held.KeyW) {
            this.y -= this.speed;
        }
        if (keyboard.held.KeyA) {
            this.x -= this.speed;
        }
        if (keyboard.held.KeyS) {
            this.y += this.speed;
        }
        if (keyboard.held.KeyD) {
            this.x += this.speed;
        }

        this.x = Math.max(0, this.x);
        this.y = Math.max(0, this.y);

        if (this.x + this.scale > 1) {
            this.x = 1 - this.scale;
        }
        if (this.y + this.scale > 1) {
            this.y = 1 - this.scale;
        }

        if (this.canFire && this.isIntendingToFire(keyboard.held)) {
            this.canFire = false;
            setTimeout(() => { this.canFire = true; }, this.fireCooldownMs);

            var position = {
                x: this.x + 0.5 * (this.scale - shots.scale),
                y: this.y + 0.5 * (this.scale - shots.scale)
            };
            var velocity = { x: 0, y: 0 };
            const SPEED = 0.01;

            if (keyboard.held.ArrowUp) {
                velocity.y -= SPEED;
            }
            if (keyboard.held.ArrowLeft) {
                velocity.x -= SPEED;
            }
            if (keyboard.held.ArrowDown) {
                velocity.y += SPEED;
            }
            if (keyboard.held.ArrowRight) {
                velocity.x += SPEED;
            }

            shots.add(position, velocity);
        }
    };

    this.isIntendingToFire = (held) => {
        return held.ArrowUp || held.ArrowLeft || held.ArrowDown || held.ArrowRight;
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
    };

    this.updateServer = (socket) => {
        socket.emit('player update', { x: this.x, y: this.y });
    };
}