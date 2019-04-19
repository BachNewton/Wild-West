function Player() {
    this.speed = 0.005;
    this.scale = 0.05;
    this.x = 0.5 - this.scale / 2;
    this.y = 0.5 - this.scale / 2;
    this.canFire = true;
    this.fireCooldownMs = 300;

    this.update = (held, shots) => {
        if (held.KeyW) {
            this.y -= this.speed;
        }
        if (held.KeyA) {
            this.x -= this.speed;
        }
        if (held.KeyS) {
            this.y += this.speed;
        }
        if (held.KeyD) {
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

        if (this.canFire && this.isIntendingToFire(held)) {
            this.canFire = false;
            setTimeout(() => { this.canFire = true; }, this.fireCooldownMs);

            var position = {
                x: this.x + 0.5 * (this.scale - shots.scale),
                y: this.y + 0.5 * (this.scale - shots.scale)
            };
            var velocity = { x: 0, y: 0 };
            const SPEED = 0.01;

            if (held.ArrowUp) {
                velocity.y -= SPEED;
            }
            if (held.ArrowLeft) {
                velocity.x -= SPEED;
            }
            if (held.ArrowDown) {
                velocity.y += SPEED;
            }
            if (held.ArrowRight) {
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