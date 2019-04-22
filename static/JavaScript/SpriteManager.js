function SpriteManager(data) {
    this.SPEED_MS = data.speedMs;
    this.image = new Image();
    this.image.src = data.imageSrc;
    this.width = data.width;
    this.height = data.height;
    this.marginX = data.marginX;
    this.marginTop = data.marginTop;
    this.marginBottom = data.marginBottom;
    this.stage = 0;
    this.stages = 0;
    this.startingX = 0;
    this.x = 0;
    this.y = 0;
    this.loop = true;
    this.lastStageTime = performance.now();

    this.draw = (ctx, x, y, width, height) => {
        ctx.drawImage(this.image, this.x + this.marginX, this.y + this.marginTop, this.width - 2 * this.marginX, this.height - this.marginTop - this.marginBottom, x, y, width, height);

        if (performance.now() - this.lastStageTime > this.SPEED_MS) {
            this.nextStage();
        }
    };

    this.playState = (startingX, y, stages, loop) => {
        this.lastStageTime = performance.now();
        this.stage = 0;
        this.stages = stages;
        this.x = startingX;
        this.y = y;
        this.startingX = startingX;
        this.loop = loop;
    };

    this.nextStage = () => {
        this.lastStageTime = performance.now();
        this.stage++;
        this.x += this.width;

        if (this.stage >= this.stages) {
            if (this.loop) {
                this.stage = 0;
                this.x = this.startingX;
            } else {
                this.stage--;
                this.x -= this.width;
            }
        }
    };
}