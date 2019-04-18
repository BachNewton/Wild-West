function Game() {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.networking = new Networking();
    this.player = new Player();
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.size = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    this.updateCanvasSize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.size = Math.min(window.innerWidth, window.innerHeight);
        this.xOffset = window.innerWidth / 2 - this.size / 2;
        this.yOffset = window.innerHeight / 2 - this.size / 2;
    };
    this.updateCanvasSize();

    window.addEventListener('resize', () => {
        this.updateCanvasSize();
    });

    this.frame = () => {
        window.requestAnimationFrame(this.frame);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update things
        this.player.update(this.keyboard, this.size);

        // Draw things
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.xOffset, this.yOffset, this.size, this.size);

        this.player.draw(this.ctx, this.size, this.xOffset, this.yOffset);
    };

    this.startAnimating = () => {
        window.requestAnimationFrame(this.frame);
    };
}