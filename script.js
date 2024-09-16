const addLedInterfaceStrategy = element => {

    element.guiA = new Konva.Circle({
        x: 0,
        y: 10,
        radius: 4,
        fill: 'red',
    });

    element.group.add(element.guiA);
    element.figure.on('click', e => console.log(element.gate.id))

    element.guiA.on('click', (e) => {
        if (!GUIManager.lastClickedInstance) {
            return;
        }

        if (!GUIManager.lastClickedInstance.drawing) {
            return;
        }
        GUIManager.lastClickedInstance.drawing = false
        const origin = GUIManager.lastClickedInstance.gate;
        const target = element.gate;
        new Wire(origin, target, 'a', origin.eventEmitter)
    })
}


const addSwitchInterfaceStrategy = element => {

    element.figure.on('click', e => {
        console.log(element.gate.id)
        element.gate.a = !element.gate.a;
    })


    element.guiS = new Konva.Circle({
        x: 50,
        y: 20,
        radius: 4,
        fill: 'red',
    });

    element.group.add(element.guiS);

    element.guiS.on('click', (e) => {
        if (element.drawing == true) {
            return;
        }

        GUIManager.lastClickedInstance = element;
        element.drawing = true;
        points = [element.guiS.getAbsolutePosition().x, element.guiS.getAbsolutePosition().y]; // Comenzar en el primer círculo
        lastPoint = { x: element.guiS.getAbsolutePosition().x, y: element.guiS.getAbsolutePosition().y };

        // Crear la línea
        line = new Konva.Line({
            points: points,
            stroke: 'blue',
            strokeWidth: 2,
            lineJoin: 'round',
        });
        layer.add(line);
        layer.draw();
    });


    element.layer.getStage().on('click', (e) => {
        if (!element.drawing) return;

        const pos = stage.getPointerPosition();
        const x = pos.x;
        const y = pos.y;

        if (Math.abs(x - lastPoint.x) > Math.abs(y - lastPoint.y)) {
            points.push(x, lastPoint.y);
            lastPoint.x = x;
        } else {
            points.push(lastPoint.x, y);
            lastPoint.y = y;
        }

        line.points(points);
        layer.draw();
    });


    element.layer.getStage().on('mousemove', (e) => {
        if (!element.drawing) return;

        const pos = stage.getPointerPosition();
        const x = element.snapToGrid(pos.x, element.gridSize);
        const y = element.snapToGrid(pos.y, element.gridSize);

        let previewPoints = [...points];

        if (Math.abs(x - lastPoint.x) > Math.abs(y - lastPoint.y)) {
            previewPoints.push(x, lastPoint.y);
        } else {
            previewPoints.push(lastPoint.x, y);
        }

        line.points(previewPoints);
        layer.draw();
    });
}



const addDoubleGateInterfaceStrategy = element => {
    element.guiA = new Konva.Circle({
        x: 0,
        y: 10,
        radius: 4,
        fill: 'red',
    });

    element.guiB = new Konva.Circle({
        x: 0,
        y: 30,
        radius: 4,
        fill: 'red',
    });

    element.group.add(element.guiA);
    element.group.add(element.guiB);

    element.guiS = new Konva.Circle({
        x: 50,
        y: 20,
        radius: 4,
        fill: 'red',
    });

    element.group.add(element.guiS);

    let line;
    let points = [];
    let lastPoint;

    element.figure.on('click', e => console.log(element.gate.id))

    element.guiS.on('click', (e) => {
        if (element.drawing == true) {
            return;
        }

        GUIManager.lastClickedInstance = element;
        element.drawing = true;
        points = [element.guiS.getAbsolutePosition().x, element.guiS.getAbsolutePosition().y]; // Comenzar en el primer círculo
        lastPoint = { x: element.guiS.getAbsolutePosition().x, y: element.guiS.getAbsolutePosition().y };

        // Crear la línea
        line = new Konva.Line({
            points: points,
            stroke: 'blue',
            strokeWidth: 2,
            lineJoin: 'round',
        });
        layer.add(line);
        layer.draw();
    });

    element.guiA.on('click', (e) => {
        if (!GUIManager.lastClickedInstance) {
            return;
        }

        if (!GUIManager.lastClickedInstance.drawing) {
            return;
        }
        GUIManager.lastClickedInstance.drawing = false
        const origin = GUIManager.lastClickedInstance.gate;
        const target = element.gate;
        new Wire(origin, target, 'a', origin.eventEmitter)
    })

    element.guiB.on('click', (e) => {
        if (!GUIManager.lastClickedInstance) {
            return;
        }

        if (!GUIManager.lastClickedInstance.drawing) {
            return;
        }
        GUIManager.lastClickedInstance.drawing = false
        const origin = GUIManager.lastClickedInstance.gate;
        const target = element.gate;
        new Wire(origin, target, 'b', origin.eventEmitter)

    })


    element.layer.getStage().on('click', (e) => {
        if (!element.drawing) return;

        const pos = stage.getPointerPosition();
        const x = pos.x;
        const y = pos.y;

        if (Math.abs(x - lastPoint.x) > Math.abs(y - lastPoint.y)) {
            points.push(x, lastPoint.y);
            lastPoint.x = x;
        } else {
            points.push(lastPoint.x, y);
            lastPoint.y = y;
        }

        line.points(points);
        layer.draw();
    });


    element.layer.getStage().on('mousemove', (e) => {
        if (!element.drawing) return;

        const pos = stage.getPointerPosition();
        const x = element.snapToGrid(pos.x, element.gridSize);
        const y = element.snapToGrid(pos.y, element.gridSize);

        let previewPoints = [...points];

        if (Math.abs(x - lastPoint.x) > Math.abs(y - lastPoint.y)) {
            previewPoints.push(x, lastPoint.y);
        } else {
            previewPoints.push(lastPoint.x, y);
        }

        line.points(previewPoints);
        layer.draw();
    });

}



class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}


class LogicGate {
    constructor(eventEmitter) {
        this._a = 0;
        this._b = 0;

        this.s = 0;

        this.eventEmitter = eventEmitter;
        this.id = Math.random().toString(36).substr(2, 9);

        return new Proxy(this, {
            set: (target, key, value) => {
                if (key === 'a' || key === 'b') {
                    target[`_${key}`] = value;
                    target.updateOutput();
                } else {
                    target[key] = value;
                }
                return true;
            },
            get: (target, key) => {
                if (key === 'a' || key === 'b') {
                    return target[`_${key}`];
                } else {
                    return target[key];
                }
            }
        });
    }

    updateOutput() {
        const data = { prev: this.s, s: this.calculateOutput() }
        this.s = this.calculateOutput();
        this.updateDraw();
        this.eventEmitter.emit(`gate:${this.id}:change`, data);
    }
}


class LogicLED {
    constructor(eventEmitter) {
        this._a = 0;
        this.s = 0;
        this.eventEmitter = eventEmitter;
        this.id = Math.random().toString(36).substr(2, 9);

        return new Proxy(this, {
            set: (target, key, value) => {
                if (key === 'a') {
                    target[`_${key}`] = value;
                    target.updateOutput();
                } else {
                    target[key] = value;
                }
                return true;
            },
            get: (target, key) => {
                if (key === 'a') {
                    return target[`_${key}`];
                } else {
                    return target[key];
                }
            }
        });
    }

    updateOutput() {
        const data = { prev: this.s, s: this.calculateOutput() }
        this.s = this.calculateOutput();
        this.updateDraw();
        this.eventEmitter.emit(`gate:${this.id}:change`, data);
    }
}


class LogicSwitch{
    constructor(eventEmitter) {
        this._a = 0;
        this.s = 0;
        this.eventEmitter = eventEmitter;
        this.id = Math.random().toString(36).substr(2, 9);

        return new Proxy(this, {
            set: (target, key, value) => {
                if (key === 'a') {
                    target[`_${key}`] = value;
                    target.updateOutput();
                } else {
                    target[key] = value;
                }
                return true;
            },
            get: (target, key) => {
                if (key === 'a') {
                    return target[`_${key}`];
                } else {
                    return target[key];
                }
            }
        });
    }

    updateOutput() {
        const data = { prev: this.s, s: this.calculateOutput() }
        this.s = this.calculateOutput();
        this.updateDraw();
        this.eventEmitter.emit(`gate:${this.id}:change`, data);
    }
}

class LogicSwitchImpl extends LogicSwitch {

    constructor(eventEmitter) { super(eventEmitter) }

    calculateOutput() {
        return this._a;
    }
}


class LogicLEDImpl extends LogicLED {

    constructor(eventEmitter) { super(eventEmitter) }

    calculateOutput() {
        return this._a;
    }
}


class LogicGateAND extends LogicGate {

    constructor(eventEmitter) { super(eventEmitter) }

    calculateOutput() {
        return this._a && this._b;
    }
}

class LogicGateOR extends LogicGate {

    constructor(eventEmitter) { super(eventEmitter) }

    calculateOutput() {
        return this._a || this._b;
    }
}


class LogicGateXOR extends LogicGate {

    constructor(eventEmitter) { super(eventEmitter) }

    calculateOutput() {
        return this._a != this._b;
    }
}



class GUIManager {

    static lastClickedInstance = null;

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
            data: 'M 0 0 L 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0',
            fill: 'cyan',
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill('cyan');
        } else {
            this.GUIManager.figure.fill('yellow');
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
            data: 'M 0 0 L 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0',
            fill: 'blue',
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill('blue');
        } else {
            this.GUIManager.figure.fill('red');
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
            fill: 'blue',
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);

    }

    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill('blue');
        } else {
            this.GUIManager.figure.fill('green');
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
            fill: 'blue',
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }


    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill('blue');
        } else {
            this.GUIManager.figure.fill('green');
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
            data: 'M 0 0 Q 25 16 0 40 L 30 40 A 2 2 90 0 0 30 0 L 0 0',
            fill: 'brown',
        });

        this.GUIManager = new GUIManager(this.layer, figure, this);
    }


    updateDraw() {
        if (this.s == 0) {
            this.GUIManager.figure.fill('blue');
        } else {
            this.GUIManager.figure.fill('green');
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
    width: 500,
    height: 400,
});


const layer = new Konva.Layer();
stage.add(layer);

factory = new GateFactory(layer);

/*
const gates = [];

const gate1 = factory.gateAND();
const gate2 = factory.gateOR();
const gate3 = factory.gateAND();
const gate4 = factory.gateOR();
const gate5 = factory.gateXOR();

const led = factory.led();
const switchitem = factory.switch();


gates.push(gate1);
gates.push(gate2);
gates.push(gate3);
gates.push(gate4);
// Conectar la salida de gate1 a la entrada A de gate2
//const wire = factory.wire(gate1, gate2, 'a');


document.querySelector('#send').addEventListener('click', () => {
    const id = document.querySelector('#idinput').value;
    const value = document.querySelector('#valueinput').value;
    const inputname = document.querySelector('#inputname').value;
    const gate = gates.filter(el => el.id == id)[0][inputname] = value
})
*/

factory.gateAND();
factory.gateAND();
factory.gateAND();
factory.gateXOR();
factory.gateXOR();
factory.gateXOR();
factory.switch();
factory.switch();
factory.switch();
factory.led();
factory.led();
factory.led();
