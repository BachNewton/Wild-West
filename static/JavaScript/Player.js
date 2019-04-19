function Player() {
    this.speed = 0.01;
    this.scale = 0.05;
    this.x = 0.5 - this.scale / 2;
    this.y = 0.5 - this.scale / 2;
    this.canFire = true;
    this.fireSpeed = 0.02;
    this.fireCooldownMs = 300;
    this.deadZone = 0.3;

    this.update = (movementVector, aimVector, shots) => {
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
    }

    this.isIntendingToFire = (aimVector) => {
        return Math.abs(aimVector.x) > this.deadZone || Math.abs(aimVector.y) > this.deadZone;
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x * size + xOffset, this.y * size + yOffset, this.scale * size, this.scale * size);
    };

    this.updateServer = (socket) => {
        socket.emit('player update', { x: this.x, y: this.y });
    };
}