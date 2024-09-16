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
        this.group = new Konva.Group({draggable: true})
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

          this.guiS = new Konva.Circle({
            x: 50,
            y: 20,
            radius: 4,
            fill: 'red',
          });

        this.group.add(this.guiS);


        let line;
        let points = [];
        let lastPoint;

        this.guiS.on('click', (e) => {
            if (this.drawing == true) {
                return;
            }

            GUIManager.lastClickedInstance = this;
            this.drawing = true;
            points = [this.guiS.getAbsolutePosition().x, this.guiS.getAbsolutePosition().y]; // Comenzar en el primer círculo
            lastPoint = { x: this.guiS.getAbsolutePosition().x, y: this.guiS.getAbsolutePosition().y };
            
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

        //para pruebas pero será al hacer click en las entradas
        this.figure.on('click', (e) => {

            GUIManager.lastClickedInstance.drawing = false
            const origin = GUIManager.lastClickedInstance.gate;
            const target = this.gate;
            new Wire(origin, target, 'a', origin.eventEmitter)
            
        })


          this.layer.getStage().on('click', (e) => {
            if (!this.drawing) return;
          
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


        this.layer.getStage().on('mousemove', (e) => {
            if (!this.drawing) return;
          
            const pos = stage.getPointerPosition();
            const x = this.snapToGrid(pos.x, this.gridSize);
            const y = this.snapToGrid(pos.y, this.gridSize);
          
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


    snapToGrid(value) {
        return Math.round(value / this.GRID_SIZE) * this.GRID_SIZE;
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


class Wire {

    constructor(outputGate, inputGate, inputName, eventEmitter) {
        console.log(outputGate, inputGate)
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
const gates = [];

const gate1 = factory.gateAND();
const gate2 = factory.gateOR();

gates.push(gate1);
gates.push(gate2);

// Conectar la salida de gate1 a la entrada A de gate2
//const wire = factory.wire(gate1, gate2, 'a');


document.querySelector('#send').addEventListener('click', () => {
    const id = document.querySelector('#idinput').value;
    const value = document.querySelector('#valueinput').value;
    const inputname = document.querySelector('#inputname').value;
    const gate = gates.filter(el => el.id == id)[0][inputname] = value
})