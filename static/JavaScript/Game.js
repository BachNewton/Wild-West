function Game() {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.touch = new Touch();
    this.gamepadManager = new GamepadManager();
    this.collisions = new Collisions();
    this.touchUI = new TouchUI();
    this.networking = new Networking();
    this.player = new Player();
    this.otherPlayers = new OtherPlayers();
    this.shots = new Shots();
    this.enemies = new Enemies();
    this.stats = { points: 0 };
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
        if (this.touch.isOn('2')) {
            this.requestFullscreen();
        }

        this.update();
        this.updateServer();
        this.draw();
    };

    this.update = () => {
        this.gamepadManager.update();
        this.touchUI.update(this.touch);
        var movementVector = this.getMovementVector() || this.gamepadManager.getMovementVector() || this.touchUI.getMovementVector();
        var aimVector = this.getAimVector() || this.gamepadManager.getAimVector() || this.touchUI.getAimVector();
        this.player.update(movementVector, aimVector, this.shots, this.enemies, this.collisions);
        this.shots.update();
        this.enemies.update(this.player, this.otherPlayers.players, this.shots, this.stats, this.collisions);
    };

    this.updateServer = () => {
        this.player.updateServer(this.networking.socket);
        this.shots.updateServer(this.networking.socket);
        this.enemies.updateServer(this.networking.socket);
    };

    this.draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.xOffset, this.yOffset, this.size, this.size);

        this.touchUI.draw(this.ctx);
        this.enemies.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.shots.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.otherPlayers.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.player.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.drawHUD();
    };

    this.drawHUD = () => {
        const MARGIN = 5;

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, 0, 140, 35);

        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Points: ' + this.stats.points, MARGIN, MARGIN);

        this.ctx.fillStyle = 'grey';
        const WIDTH = 120;
        const HEIGHT = 35;
        this.ctx.fillRect(this.canvas.width - WIDTH, 0, WIDTH, HEIGHT);

        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Lives: ' + this.player.lives, this.canvas.width - MARGIN, MARGIN);
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

    this.networking.socket.on('new enemy', (position, target, type) => {
        this.enemies.makeNewEnemyFromServer(position, target, type);
    });
}