function Ammo() {
    this.ammo = [];
    this.scale = 0.04;
    this.image = new Image();
    this.image.src = '/static/Textures/ammo.png';

    this.restart = () => {
        this.ammo = [];
    };

    this.update = (player, otherPlayers, collisions) => {
        for (var i = 0; i < this.ammo.length; i++) {
            var pack = this.ammo[i];

            var box1 = {
                x: pack.x,
                y: pack.y,
                width: this.scale,
                height: this.scale
            };

            var box2 = {
                x: player.x,
                y: player.y,
                width: player.scale,
                height: player.scale
            };

            if (collisions.isCollision(box1, box2)) {
                new Audio('/static/Sounds/ammo.mp3').play();

                player.ammo += 5;

                this.ammo.splice(i, 1);
                i--;
            } else {
                for (var id in otherPlayers.players) {
                    var otherPlayer = otherPlayers.players[id];

                    box2 = {
                        x: otherPlayer.position.x,
                        y: otherPlayer.position.y,
                        width: otherPlayers.scale,
                        height: otherPlayers.scale
                    };

                    if (collisions.isCollision(box1, box2)) {
                        this.ammo.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
    };

    this.add = (position) => {
        position.x -= this.scale / 2;
        position.y -= this.scale / 2;

        this.ammo.push({
            x: position.x,
            y: position.y
        });
    };

    this.draw = (ctx, size, xOffset, yOffset) => {
        for (var ammo of this.ammo) {
            ctx.drawImage(this.image, ammo.x * size + xOffset, ammo.y * size + yOffset, this.scale * size, this.scale * size);
        }
    };
}