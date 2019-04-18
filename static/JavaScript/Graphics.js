function Graphics() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    // this.size = 0;

    this.updateCanvasSize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.size = Math.min(window.innerWidth, window.innerHeigh);
    };
    this.updateCanvasSize();

    window.addEventListener('resize', () => {
        this.updateCanvasSize();
    });

    this.frame = () => {
        window.requestAnimationFrame(this.frame);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw things
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, 100, 100);
    };

    this.startAnimating = () => {
        window.requestAnimationFrame(this.frame);
    };
}