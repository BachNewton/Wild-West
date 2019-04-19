function TouchUI() {
    this.ringRadius = 100;
    this.ringThickness = 5;
    this.padRadius = 30;

    this.movement = {
        on: false,
        startingX: -1,
        startingY: -1,
        x: -1,
        y: -1
    };

    this.aim = {
        on: false,
        startingX: -1,
        startingY: -1,
        x: -1,
        y: -1
    };

    this.update = (touches) => {
        if ('0' in touches) {
            if (this.movement.on) {
                this.movement.x = touches['0'].x;
                this.movement.y = touches['0'].y;
            } else {
                this.movement.on = true;
                this.movement.startingX = touches['0'].x;
                this.movement.startingY = touches['0'].y;
            }
        } else {
            this.movement.on = false;
        }

        if ('1' in touches) {
            if (this.aim.on) {
                this.aim.x = touches['1'].x;
                this.aim.y = touches['1'].y;
            } else {
                this.aim.on = true;
                this.aim.startingX = touches['1'].x;
                this.aim.startingY = touches['1'].y;
            }
        } else {
            this.aim.on = false;
        }
    };

    this.draw = (ctx) => {
        if (this.movement.on) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.movement.startingX, this.movement.startingY, this.ringRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.movement.startingX, this.movement.startingY, this.ringRadius - this.ringThickness, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'purple';
            ctx.beginPath();
            ctx.arc(this.movement.x, this.movement.y, this.padRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.aim.on) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.aim.startingX, this.aim.startingY, this.ringRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.aim.startingX, this.aim.startingY, this.ringRadius - this.ringThickness, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'purple';
            ctx.beginPath();
            ctx.arc(this.aim.x, this.aim.y, this.padRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    };
}