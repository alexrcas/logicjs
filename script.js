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
        const data = {prev: this.s, s: this.calculateOutput()}
        this.s = this.calculateOutput();
        this.draw();
        this.eventEmitter.emit(`gate:${this.id}:change`, data);
    }

    calculateOutput() {
        throw new Error(`subclass does not override calculateOutput() method`)
    }

    draw() {
        throw new Error(`subclass does not override draw() method`)
    }

}


class GateAND extends LogicGate {

    constructor(eventEmitter) {super(eventEmitter)}

    calculateOutput() {
        return this._a && this._b;
    }
}

class GateOR extends LogicGate {

    constructor(eventEmitter) {super(eventEmitter)}

    calculateOutput() {
        return this._a || this._b;
    }
}


class GateXOR extends LogicGate {

    constructor(eventEmitter) {super(eventEmitter)}

    calculateOutput() {
        return this._a != this._b;
    }
}


class GUIGateAND extends GateAND {
    
    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
    }

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>${this.id} | AND | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
        `;
        fragment.append(div);
        document.body.appendChild(fragment);
    }

}


class GUIGateOR extends GateOR {
    
    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
    }

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>${this.id} | OR | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
        `;
        fragment.append(div);
        document.body.appendChild(fragment);
    }

}

class GUIGateXOR extends GateXOR {
    
    constructor(x, y, layer, eventEmitter) {
        super(eventEmitter);
    }

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>${this.id} | XOR | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
        `;
        fragment.append(div);
        document.body.appendChild(fragment);
    }

}


class Wire {

    constructor(outputGate, inputGate, inputName, eventEmitter) {
        eventEmitter.on(`gate:${outputGate.id}:change`, data => {
            if (data.prev != data.s) {
                inputGate[inputName] = data.s;
            }
        });

        if (outputGate.output !== undefined) {
            inputGate[inputName] = outputGate.output;
        }
    }
}


class GateFactory {

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    gateAND() { return new GUIGateAND(0, 0, null, this.eventEmitter) }

    gateOR() { return new GUIGateOR(0, 0, null, this.eventEmitter) }

    gateXOR() { return new GUIGateXOR(0, 0, null, this.eventEmitter) }

    wire(outputGate, inputGate, inputName) { return new Wire(outputGate, inputGate, inputName, this.eventEmitter) }

}

factory = new GateFactory();
const gates = [];

const gate1 = factory.gateAND();
const gate2 = factory.gateOR();

gates.push(gate1);
gates.push(gate2);

// Conectar la salida de gate1 a la entrada A de gate2
const wire = factory.wire(gate1, gate2, 'b');

gate1.draw();
gate2.draw();

document.querySelector('#send').addEventListener('click', () => {
    const id = document.querySelector('#idinput').value;
    const value = document.querySelector('#valueinput').value;
    const inputname = document.querySelector('#inputname').value;
    const gate = gates.filter(el => el.id == id)[0][inputname] = value
})