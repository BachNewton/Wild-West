function Ammo() {
    this.ammo = [];
    this.scale = 0.04;
    this.image = new Image();
    this.image.src = '/static/Textures/ammo.png';

    this.restart = () => {
        this.ammo = [];
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