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