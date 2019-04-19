function Touch() {
    this.touches = {};

    this.isOn = (id) => {
        return id in this.touches && this.touches[id].on;
    };

    this.updatePosition = (id, x, y) => {
        this.touches[id].on = true;
        this.touches[id].x = x;
        this.touches[id].y = y;
    };

    this.createNewTouch = (id) => {
        this.touches[id] = {
            on: false,
            x: -1,
            y: -1
        }
    };

    document.addEventListener('touchstart', (e) => {
        for (var touch of e.touches) {
            var id = touch.identifier;

            if (!(id in this.touches)) {
                this.createNewTouch(id);
            }

            this.updatePosition(id, touch.clientX, touch.clientY);
        }
    });

    document.addEventListener('touchend', (e) => {
        // First, clear everything
        for (var id in this.touches) {
            this.touches[id].on = false;
        }

        // Then, add only the current touches
        for (var touch of e.touches) {
            this.touches[touch.identifier].on = true;
        }
    });

    document.addEventListener('touchmove', (e) => {
        for (var touch of e.touches) {
            this.updatePosition(touch.identifier, touch.clientX, touch.clientY);
        }
    });
}