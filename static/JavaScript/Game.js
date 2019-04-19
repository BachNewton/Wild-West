function Game() {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.touch = new Touch();
    this.touchUI = new TouchUI();
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

        // If the screen was touched withed with 3 fingers
        if ('2' in this.touch.touches) {
            this.requestFullscreen();
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update things
        this.touchUI.update(this.touch.touches);
        var movementVector = this.getMovementVector() || this.touchUI.getMovementVector();
        var aimVector = this.getAimVector() || this.touchUI.getAimVector();
        this.player.update(movementVector, aimVector, this.shots);
        this.shots.update();

        // Send things to server
        this.player.updateServer(this.networking.socket);
        this.shots.updateServer(this.networking.socket);

        // Draw things
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.xOffset, this.yOffset, this.size, this.size);

        this.touchUI.draw(this.ctx);
        this.shots.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.otherPlayers.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.player.draw(this.ctx, this.size, this.xOffset, this.yOffset);
    };

    this.startAnimating = () => {
        this.updateCanvasSize();
        window.requestAnimationFrame(this.frame);
    };

    this.getMovementVector = () => {
        var vector = { x: 0, y: 0 };
        const MAX = 0.8;

        if (this.keyboard.held.KeyW) {
            vector.y = -MAX;
        } else if (this.keyboard.held.KeyS) {
            vector.y = MAX;
        }

        if (this.keyboard.held.KeyA) {
            vector.x = -MAX;
        } else if (this.keyboard.held.KeyD) {
            vector.x = MAX;
        }

        if (vector.x !== 0 || vector.y !== 0) {
            return vector;
        } else {
            return false;
        }
    };

    this.getAimVector = () => {
        var vector = { x: 0, y: 0 };

        if (this.keyboard.held.ArrowUp) {
            vector.y = -1;
        } else if (this.keyboard.held.ArrowDown) {
            vector.y = 1;
        }

        if (this.keyboard.held.ArrowLeft) {
            vector.x = -1;
        } else if (this.keyboard.held.ArrowRight) {
            vector.x = 1;
        }

        if (vector.x !== 0 || vector.y !== 0) {
            return vector;
        } else {
            return false;
        }
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

    this.networking.socket.on('new shot', (position, velocity) => {
        this.shots.addFromServer(position, velocity);
    });
}