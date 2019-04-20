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

    this.getMovementVector = () => {
        return this.getVector(this.movement);
    };

    this.getAimVector = () => {
        return this.getVector(this.aim);
    };

    this.getVector = (axis) => {
        var vector = { x: 0, y: 0 };

        if (axis.on) {
            vector.x = Math.min(this.ringRadius, Math.max(-this.ringRadius, axis.x - axis.startingX)) / this.ringRadius;
            vector.y = Math.min(this.ringRadius, Math.max(-this.ringRadius, axis.y - axis.startingY)) / this.ringRadius;
        }

        return vector;
    };

    this.update = (touch) => {
        if (touch.isOn('0')) {
            var x = touch.touches['0'].x;
            var y = touch.touches['0'].y;
            this.updateAxis(this.movement, x, y);
        } else {
            this.movement.on = false;
        }

        if (touch.isOn('1')) {
            var x = touch.touches['1'].x;
            var y = touch.touches['1'].y;
            this.updateAxis(this.aim, x, y);
        } else {
            this.aim.on = false;
        }
    };

    this.updateAxis = (axis, x, y) => {
        if (axis.on) {
            axis.x = x;
            axis.y = y;
        } else {
            axis.on = true;
            axis.startingX = x;
            axis.startingY = y;
        }
    };

    this.draw = (ctx) => {
        if (this.movement.on) {
            this.drawAxis(ctx, this.movement);
        }

        if (this.aim.on) {
            this.drawAxis(ctx, this.aim);
        }
    };

    this.drawAxis = (ctx, axis) => {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(axis.startingX, axis.startingY, this.ringRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(axis.startingX, axis.startingY, this.ringRadius - this.ringThickness, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(axis.x, axis.y, this.padRadius, 0, Math.PI * 2);
        ctx.fill();
    };
}