function Shots() {
    this.shots = [];
    this.scale = 0.015;
    this.shotsForServer = [];

    this.restart = () => {
        this.shots = [];
    };

    this.getNewShot = (position, velocity) => {
        new Audio('/static/Sounds/shot.mp3').play();

        return {
            position: position,
            velocity: velocity
        };
    };

    this.add = (position, velocity) => {
        var shot = this.getNewShot(position, velocity);
        this.shots.push(shot);
        this.shotsForServer.push(shot);
    };

    this.addFromServer = (position, velocity) => {
        var shot = this.getNewShot(position, velocity);
        this.shots.push(shot);
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        ctx.fillStyle = 'red';

        for (var shot of this.shots) {
            var x = shot.position.x;
            var y = shot.position.y;

            ctx.fillRect(x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };

    this.update = (bounds) => {
        for (var i = 0; i < this.shots.length; i++) {
            var shot = this.shots[i];

            shot.position.x += shot.velocity.x;
            shot.position.y += shot.velocity.y;

            if (!this.isInBounds(shot, bounds)) {
                this.shots.splice(i, 1);
                i--;
            }
        }
    };

    this.isInBounds = (shot, bounds) => {
        return shot.position.x + this.scale > bounds.leftX && shot.position.x < bounds.rightX && shot.position.y + this.scale > bounds.topY && shot.position.y < bounds.bottomY;
    };

    this.updateServer = (socket) => {
        for (shot of this.shotsForServer) {
            socket.emit('new shot', shot.position, shot.velocity);
        }

        this.shotsForServer = [];
    };
}