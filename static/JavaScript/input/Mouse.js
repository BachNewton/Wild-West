function Mouse() {
    this.wheel = 0;
    this.isDown = false;
    this.postion = { x: -1, y: -1 };

    this.clearWheel = () => { this.wheel = 0; };

    document.addEventListener('wheel', (e) => { this.wheel += e.deltaY; });

    document.addEventListener('mousedown', () => { this.isDown = true; });

    document.addEventListener('mouseup', () => { this.isDown = false; });

    document.addEventListener('mousemove', (e) => {
        this.postion.x = e.clientX;
        this.postion.y = e.clientY;
    });
}