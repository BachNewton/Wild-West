function Game() {
    // setTimeout(() => { new Audio('/static/Sounds/backgroundMusic.ogg').play(); }, 1000);
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.touch = new Touch();
    this.gamepadManager = new GamepadManager();
    this.collisions = new Collisions();
    this.touchUI = new TouchUI();
    this.networking = new Networking();
    this.ground = new Ground();
    this.player = new Player();
    this.otherPlayers = new OtherPlayers();
    this.shots = new Shots();
    this.enemies = new Enemies();
    this.ammo = new Ammo();
    this.stats = { points: 0 };
    this.bounds = { leftX: -1, rightX: 2, topY: -1, bottomY: 2 };
    this.gameOver = false;
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

        if (!this.gameOver && this.isEveryoneDead()) {
            this.gameOver = true;
            setTimeout(() => { this.endGame(); }, 5000);
        }

        this.update();
        // this.updateServer();
        this.draw();
    };

    this.update = () => {
        this.gamepadManager.update();
        this.touchUI.update(this.touch);
        var movementVector = this.getMovementVector() || this.gamepadManager.getMovementVector() || this.touchUI.getMovementVector();
        var aimVector = this.getAimVector() || this.gamepadManager.getAimVector() || this.touchUI.getAimVector();
        var reviveAttempt = this.keyboard.held.KeyE || this.gamepadManager.controller.button.A;
        this.player.update(movementVector, aimVector, reviveAttempt, this.otherPlayers, this.shots, this.enemies, this.collisions, this.bounds);
        this.shots.update(this.bounds);
        this.enemies.update(this.player, this.otherPlayers, this.shots, this.stats, this.collisions, this.bounds, this.ammo);
        this.ammo.update(this.player, this.otherPlayers, this.collisions);
    };

    this.updateServer = () => {
        this.player.updateServer(this.networking.socket);
        this.shots.updateServer(this.networking.socket);
        this.enemies.updateServer(this.networking.socket);
    };

    this.draw = () => {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.centerCameraOnPlayer();
        this.ground.draw(this.ctx, this.size, this.xOffset, this.yOffset, this.bounds);

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.touchUI.draw(this.ctx);

        this.centerCameraOnPlayer();
        this.enemies.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.shots.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.ammo.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.otherPlayers.draw(this.ctx, this.size, this.xOffset, this.yOffset);
        this.player.draw(this.ctx, this.size, this.xOffset, this.yOffset);

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawHUD();
    };

    this.centerCameraOnPlayer = () => {
        this.ctx.translate(-((this.player.x + this.player.scale / 2) * this.size + this.xOffset) + this.canvas.width / 2, -((this.player.y + this.player.scale / 2) * this.size + this.yOffset) + this.canvas.height / 2);
    };

    this.drawHUD = () => {
        const MARGIN = 5;
        const HEIGHT = 20;
        const FONT_SIZE = 10; // (30 * (window.innerHeight / 1080)).toFixed(0);

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, 0, 160, HEIGHT);

        this.ctx.font = FONT_SIZE + 'px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Points: ' + this.stats.points, MARGIN, MARGIN);

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.canvas.width - 120, 0, 120, HEIGHT);

        this.ctx.font = FONT_SIZE + 'px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Lives: ' + this.player.lives, this.canvas.width - MARGIN, MARGIN);

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.canvas.width / 2 - 100, 0, 200, HEIGHT);

        this.ctx.font = FONT_SIZE + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Ammo: ' + this.player.ammo, this.canvas.width / 2, MARGIN);

        if (this.gameOver) {
            this.ctx.font = '60px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = 'red';
            this.ctx.fillText('GAME OVER!', this.canvas.width / 2, this.canvas.height / 2);
        }
    };

    this.isEveryoneDead = () => {
        if (this.player.lives > 0) {
            return false;
        }

        for (var id in this.otherPlayers.players) {
            var player = this.otherPlayers.players[id];

            if (player.lives > 0) {
                return false;
            }
        }

        return true;
    };

    this.endGame = () => {
        this.restart();
        this.networking.socket.emit('restart');
    };

    this.restart = () => {
        this.gameOver = false;
        this.stats.points = 0;
        this.player.restart();
        this.shots.restart();
        this.enemies.restart();
        this.ammo.restart();
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

    this.networking.socket.on('player update', (id, data) => {
        this.otherPlayers.update(id, data);
    });

    this.networking.socket.on('revive', () => {
        this.player.revive();
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

    this.networking.socket.on('restart', () => {
        this.restart();
    });
}