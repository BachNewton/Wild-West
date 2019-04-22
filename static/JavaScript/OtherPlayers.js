function OtherPlayers() {
    this.players = {};
    this.scale = 0.1;
    this.state = 0;
    this.STATE = {
        IDLE_E: 0,
        WALKING_E: 1,
        IDLE_S: 2,
        WALKING_S: 3,
        IDLE_W: 4,
        WALKING_W: 5,
        IDLE_N: 6,
        WALKING_N: 7,
        DEAD: 8
    };
    this.spriteManager = new SpriteManager({
        imageSrc: '/static/Textures/otherPlayer.png',
        width: 64,
        height: 64,
        marginX: 5,
        marginTop: 10,
        marginBottom: 0,
        speedMs: 100
    });

    this.playState = () => {
        switch (this.state) {
            case this.STATE.IDLE_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_E:
                return this.spriteManager.playState(0, 11 * this.spriteManager.height, 9, true);
            case this.STATE.IDLE_S:
                return this.spriteManager.playState(0, 10 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_S:
                return this.spriteManager.playState(64, 10 * this.spriteManager.height, 8, true);
            case this.STATE.IDLE_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_W:
                return this.spriteManager.playState(0, 9 * this.spriteManager.height, 9, true);
            case this.STATE.IDLE_N:
                return this.spriteManager.playState(0, 8 * this.spriteManager.height, 1, false);
            case this.STATE.WALKING_N:
                return this.spriteManager.playState(64, 8 * this.spriteManager.height, 8, true);
            case this.STATE.DEAD:
                return this.spriteManager.playState(0, 20 * this.spriteManager.height, 6, false);
        }
    };

    this.update = (id, data) => {
        if (id in this.players) {
            this.players[id].position = { x: data.x, y: data.y };
            this.players[id].isInvincible = data.isInvincible;
            this.players[id].lives = data.lives;

            if (this.state !== data.state) {
                this.state = data.state;
                this.playState();
            }
        } else {
            this.players[id] = {};
            this.update(id, data);
        }
    };

    this.getCenter = (player) => {
        return {
            x: player.position.x + this.scale / 2,
            y: player.position.y + this.scale / 2
        };
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        for (var id in this.players) {
            var player = this.players[id];

            var x = player.position.x;
            var y = player.position.y;

            this.spriteManager.draw(ctx, x * size + xOffset, y * size + yOffset, this.scale * size, this.scale * size);
        }
    };

    this.remove = (id) => {
        delete this.players[id];
    };
}