function Game() {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.networking = new Networking();
    this.player = new Player();
    this.otherPlayers = new OtherPlayers();
    this.shots = new Shots();
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

    window.addEventListener('resize', () => {
        this.updateCanvasSize();
    });

    this.frame = () => {
        window.requestAnimationFrame(this.frame);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update things
        this.player.update(this.keyboard, this.size, this.shots);
        this.shots.update(this.size);

        // Send things to server
        this.player.updateServer(this.networking.socket);

        // Draw things
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.xOffset, this.yOffset, this.size, this.size);

        this.shots.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.otherPlayers.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.player.draw(this.ctx, this.size, this.xOffset, this.yOffset);
    };

    this.startAnimating = () => {
        this.updateCanvasSize();
        window.requestAnimationFrame(this.frame);
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            this.requestFullscreen();
        }
    });

    this.requestFullscreen = () => {
        var element = document.body;
        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
    };

    this.networking.socket.on('player update', (id, position) => {
        this.otherPlayers.update(id, position);
    });

    this.networking.socket.on('player disconnected', (id) => {
        this.otherPlayers.remove(id);
    });
}