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
    
    
    class LogicGateAND {
        constructor(eventEmitter) {
            this._a = 0;
            this._b = 0;
          
            this.s = 0;
    
            this.eventEmitter = eventEmitter;
            this.id = Math.random().toString(36).substr(2, 9);
    
            // Crear el Proxy para interceptar cambios en `a` y `b`
            return new Proxy(this, {
                set: (target, key, value) => {
                    if (key === 'a' || key === 'b') {
                        target[`_${key}`] = value;
                        target.updateOutput();  // Recalcular la salida al cambiar `a` o `b`
                    } else {
                        target[key] = value;  // Establecer otros atributos normalmente
                    }
                    return true;
                },
                get: (target, key) => {
                    if (key === 'a' || key === 'b') {
                        return target[`_${key}`];  // Retornar los valores de `a` y `b`
                    } else {
                        return target[key];  // Retornar otros atributos normalmente
                    }
                }
            });
        }
    
        updateOutput() {
            this.s = this.calculateOutput();
            this.eventEmitter.emit(`gate:${this.id}:change`, this.calculateOutput());
        }
    
        // Método para calcular la salida (ejemplo con AND)
        calculateOutput() {
            return this._a && this._b;
        }
    }
    
    class Wire {
        constructor(outputGate, inputGate, inputName, eventEmitter) {
            // Suscribirse al evento 'change' del outputGate a través del EventEmitter
            eventEmitter.on(`gate:${outputGate.id}:change`, value => {
                inputGate[inputName] = value;  // Actualiza la entrada de la puerta de destino
            });
    
            // Propaga el valor inicial si la salida ya está calculada
            if (outputGate.output !== undefined) {
                inputGate[inputName] = outputGate.output;
            }
        }
    }
    
    
    const eventEmitter = new EventEmitter();
    
    const gate1 = new LogicGateAND(eventEmitter);
    const gate2 = new LogicGateAND(eventEmitter);
    
    // Conectar la salida de gate1 a la entrada A de gate2
    new Wire(gate1, gate2, 'a', eventEmitter);
    
    gate1.a = 1; 
    
    console.log(gate1.calculateOutput())
    
    setTimeout(() => {
      console.log('cambiando input a ' + gate1.id)
      gate1.b = 1
      console.log(gate1.s)
    }, 3000)
    
    setTimeout(() => {
      console.log('cambiando input a ' + gate2.id)
      gate2.b = 0
    }, 6000)
    