function Graphics() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    this.updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    this.updateCanvasSize();

    window.addEventListener('resize', () => {
        this.updateCanvasSize();
    });

    this.frame = () => {
        window.requestAnimationFrame(this.frame);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw things
    };

    this.startAnimating = () => {
        window.requestAnimationFrame(this.frame);
    };
}