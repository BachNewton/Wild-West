function Shots() {
    this.shots = [];
    this.scale = 0.015;
    this.shotsForServer = [];

    this.restart = () => {
        this.shots = [];
    };

    this.add = (position, velocity) => {
        var shot = {
            position: position,
            velocity: velocity
        };

        this.shots.push(shot);
        this.shotsForServer.push(shot);
    };

    this.addFromServer = (position, velocity) => {
        var shot = {
            position: position,
            velocity: velocity
        };

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

    this.update = () => {
        for (var i = 0; i < this.shots.length; i++) {
            var shot = this.shots[i];

            shot.position.x += shot.velocity.x;
            shot.position.y += shot.velocity.y;

            if (shot.position.x + this.scale < 0 || shot.position.x > 1 || shot.position.y + this.scale < 0 || shot.position.y > 1) {
                this.shots.splice(i, 1);
                i--;
            }
        }
    };

    this.updateServer = (socket) => {
        for (shot of this.shotsForServer) {
            socket.emit('new shot', shot.position, shot.velocity);
        }

        this.shotsForServer = [];
    };
}