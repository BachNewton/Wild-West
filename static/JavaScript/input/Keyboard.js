function Keyboard() {
    this.held = {};

    document.addEventListener('keydown', (e) => { this.held[e.code] = true; });

    document.addEventListener('keyup', (e) => { this.held[e.code] = false; });
}