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

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>AND | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
        `;
        fragment.append(div);
        document.body.appendChild(fragment);
    }
}

class GateOR extends LogicGate {

    constructor(eventEmitter) {super(eventEmitter)}

    calculateOutput() {
        return this._a || this._b;
    }

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>OR | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
        `;
        fragment.append(div);
        document.body.appendChild(fragment);
    }
}


class GateXOR extends LogicGate {

    constructor(eventEmitter) {super(eventEmitter)}

    calculateOutput() {
        return this._a != this._b;
    }

    draw() {
        let fragment = new DocumentFragment();
        let div = document.createElement('div');
        div.innerHTML = `
            <span>XOR | A: ${this._a}, B: ${this._b} | S: ${this.s}</span>
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

    gateAND() { return new GateAND(this.eventEmitter) }

    gateOR() { return new GateOR(this.eventEmitter) }

    gateXOR() { return new GateXOR(this.eventEmitter) }

    wire(outputGate, inputGate, inputName) { return new Wire(outputGate, inputGate, inputName, this.eventEmitter) }

}

factory = new GateFactory();

const gate1 = factory.gateAND();
const gate2 = factory.gateOR();

// Conectar la salida de gate1 a la entrada A de gate2
const wire = factory.wire(gate1, gate2, 'b');

gate1.draw();
gate2.draw();

setTimeout(() => {
    gate1.b = 1
}, 3000)

setTimeout(() => {
    gate1.a = 1
}, 6000)
