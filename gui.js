class GUIManager {

    static lastClickedInstance = null;

    static offColor = '#219ebc';
    static onColor = '#e9c46a';

    constructor(layer, figure, gate) {
        this.gate = gate;
        this.layer = layer;
        this.figure = figure;
        this.group = new Konva.Group({ draggable: true })
        this.group.add(this.figure)
        this.layer.add(this.group);
        this.GRID_SIZE = 10;

        this.drawing = false;

        this.group.on('dragmove', () => {
            let absPos = this.group.getAbsolutePosition();
            absPos.x = this.snapToGrid(absPos.x);
            absPos.y = this.snapToGrid(absPos.y);
            this.group.setAbsolutePosition(absPos);
            layer.draw();
        });

        if (this.gate instanceof GUILED) {
            addLedInterfaceStrategy(this);
            return;
        }

        if (this.gate instanceof GUISwitch) {
            addSwitchInterfaceStrategy(this);
            return;
        }
        
        addDoubleGateInterfaceStrategy(this);
    }

    snapToGrid(value) {
        return Math.round(value / this.GRID_SIZE) * this.GRID_SIZE;
    }

}

class GUILED extends LogicLEDImpl {

    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
        this.x = x;
        this.y = y;
        this.layer = layer;

        const figure = new Konva.Path({
            x: this.x,
            y: this.y,
            data: 'M 15.3022 14.8133 h 5.1924 l -2.5962 4.4968 L 15.3022 14.8133 z M 34.8048 17.2661 c 0 6.1041 -3.1257 11.6334 -8.3616 14.7905 c -0.9646 0.5816 -1.5639 1.6369 -1.5639 2.7538 v 3.2643 c 0 1.8143 -1.0728 3.3786 -2.6152 4.104 c 0.0207 0.1023 0.0319 0.208 0.0319 0.3164 c 0 0.8739 -0.7081 1.582 -1.582 1.582 h -6.3513 c -0.8737 0 -1.582 -0.7081 -1.582 -1.582 c 0 -0.1084 0.011 -0.2141 0.0319 -0.3164 c -1.5424 -0.7252 -2.6152 -2.2897 -2.6152 -4.104 V 34.811 c 0 -1.1323 -0.5925 -2.1665 -1.5848 -2.7669 c -5.2954 -3.2035 -8.4892 -9.0342 -8.3352 -15.2172 c 0.1101 -4.4276 1.9121 -8.6052 5.0741 -11.7631 C 8.5134 1.9062 12.6931 0.1093 17.1207 0.0046 C 26.8261 -0.219 34.8048 7.607 34.8048 17.2661 z M 24.6047 12.4402 c -0.2827 -0.4894 -0.8047 -0.791 -1.37 -0.791 H 12.5621 c -0.5653 0 -1.0874 0.3016 -1.37 0.791 s -0.2827 1.0927 0 1.582 l 5.1243 8.8758 v 9.912 c 0 0.8739 0.7083 1.582 1.582 1.582 c 0.8739 0 1.582 -0.7081 1.582 -1.582 v -9.912 l 5.1243 -8.8758 C 24.8874 13.5329 24.8874 12.9298 24.6047 12.4402 z',
            fill: GUIManager.offColor
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill(GUIManager.offColor);
        } else {
            this.GUIManager.figure.fill(GUIManager.onColor);
        }
        this.layer.draw();
    }
}


class GUISwitch extends LogicSwitchImpl {

    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
        this.x = x;
        this.y = y;
        this.layer = layer;

        const figure = new Konva.Path({
            x: this.x,
            y: this.y,
            data: 'M 42 0 H 2 c -1.1 0 -2 0.9 -2 2 v 32 c 0 1.1 0.9 2 2 2 h 40 c 1.1 0 2 -0.9 2 -2 V 2 C 44 0.9 43.1 0 42 0 z M 40 32 H 4 V 4 h 36 V 32 z M 17 30 h -9.9 c -0.6 0 -1 -0.4 -1 -1 V 7 c 0 -0.6 0.4 -1 1 -1 H 17 c 0.6 0 1 0.4 1 1 v 22 C 18 29.6 17.6 30 17 30 z',
            fill: GUIManager.offColor,
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill(GUIManager.offColor);
            this.GUIManager.figure.data('M 42 0 H 2 c -1.1 0 -2 0.9 -2 2 v 32 c 0 1.1 0.9 2 2 2 h 40 c 1.1 0 2 -0.9 2 -2 V 2 C 44 0.9 43.1 0 42 0 z M 40 32 H 4 V 4 h 36 V 32 z M 17 30 h -9.9 c -0.6 0 -1 -0.4 -1 -1 V 7 c 0 -0.6 0.4 -1 1 -1 H 17 c 0.6 0 1 0.4 1 1 v 22 C 18 29.6 17.6 30 17 30 z')
        } else {
            this.GUIManager.figure.fill(GUIManager.onColor);
            this.GUIManager.figure.data('M 42 0 H 2 c -1.1 0 -2 0.9 -2 2 v 32 c 0 1.1 0.9 2 2 2 h 40 c 1.1 0 2 -0.9 2 -2 V 2 C 44 0.9 43.1 0 42 0 z M 40 32 H 4 V 4 h 36 V 32 z M 37 30 h -9.9 c -0.6 0 -1 -0.4 -1 -1 V 7 c 0 -0.6 0.4 -1 1 -1 H 37 c 0.6 0 1 0.4 1 1 v 22 C 38 29.6 37.6 30 37 30 z')
        }
        this.layer.draw();
    }
}




class GUIGateAND extends LogicGateAND {

    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
        this.x = x;
        this.y = y;
        this.layer = layer;

        const figure = new Konva.Path({
            x: this.x,
            y: this.y,
            data: 'M 0 0 L 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0',
            fill: GUIManager.offColor,
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);

    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill(GUIManager.offColor);
        } else {
            this.GUIManager.figure.fill(GUIManager.onColor);
        }
        this.layer.draw();
    }

}


class GUIGateOR extends LogicGateOR {

    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
        this.x = x;
        this.y = y;
        this.layer = layer;

        const figure = new Konva.Path({
            x: this.x,
            y: this.y,
            data: 'M 0 0 Q 25 16 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0',
            fill: GUIManager.offColor,
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }


    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill(GUIManager.offColor);
        } else {
            this.GUIManager.figure.fill(GUIManager.onColor);
        }
        this.layer.draw();
    }

}

class GUIGateXOR extends LogicGateXOR {

    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
        this.x = x;
        this.y = y;
        this.layer = layer;

        const figure = new Konva.Path({
            x: this.x,
            y: this.y,
            data: 'M 0 0 Q 25 16 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0 Q 20 16 0 40 Q 13 16 0 0',
            fill: GUIManager.offColor,
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }


    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill(GUIManager.offColor);
        } else {
            this.GUIManager.figure.fill(GUIManager.onColor);
        }
        this.layer.draw();
    }

}


class Wire {

    constructor(outputGate, inputGate, inputName, eventEmitter) {
        eventEmitter.on(`gate:${outputGate.id}:change`, data => {
            if (data.prev != data.s) {
                inputGate[inputName] = data.s;
            }
        });

        if (outputGate.s !== undefined) {
            inputGate[inputName] = outputGate.s;
        }
    }
}


class GateFactory {

    constructor(layer) {
        this.layer = layer;
        this.eventEmitter = new EventEmitter();
    }

    gateAND() { return new GUIGateAND(0, 0, layer, this.eventEmitter) }

    gateOR() { return new GUIGateOR(0, 0, layer, this.eventEmitter) }

    gateXOR() { return new GUIGateXOR(0, 0, layer, this.eventEmitter) }

    led() { return new GUILED(0, 0, layer, this.eventEmitter) }

    switch() { return new GUISwitch(0, 0, layer, this.eventEmitter) }

    wire(outputGate, inputGate, inputName) { return new Wire(outputGate, inputGate, inputName, this.eventEmitter) }

}

const stage = new Konva.Stage({
    container: 'canvas',
    width: 1000,
    height: 1000,
});


const layer = new Konva.Layer();
stage.add(layer);

factory = new GateFactory(layer);

document.querySelector('#newOR').addEventListener('click', () => {
    factory.gateOR();
})

document.querySelector('#newAND').addEventListener('click', () => {
    factory.gateAND();
})

document.querySelector('#newXOR').addEventListener('click', () => {
    factory.gateXOR();
})

document.querySelector('#newLED').addEventListener('click', () => {
    factory.led();
})

document.querySelector('#newSwitch').addEventListener('click', () => {
    factory.switch();
})