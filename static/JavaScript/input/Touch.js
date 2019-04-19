function Touch() {
    this.touches = {};

    document.addEventListener('touchstart', (e) => {
        for (var touch of e.touches) {
            var id = touch.identifier;
            this.touches[id] = { x: -1, y: -1 };
            this.updatePosition(id, touch.clientX, touch.clientY);
        }
    });

    document.addEventListener('touchend', (e) => {
        // TODO - This needs works
        // TODO - touchend has a list of the remaining touches, not a list of the ended touches

        if (e.touches.length > 0) {
            for (var touch of e.touches) {
                var id = touch.identifier;
                delete this.touches[id];
            }
        } else {
            this.touches = {};
        }
    });

    document.addEventListener('touchmove', (e) => {
        for (var touch of e.touches) {
            var id = touch.identifier;
            this.updatePosition(id, touch.clientX, touch.clientY);
        }
    });

    this.updatePosition = (id, x, y) => {
        if (id in this.touches) {
            this.touches[id].x = x;
            this.touches[id].y = y;
        }
    };
}