
class Input {

    constructor(name, gate, x, y) {

        this.name = name;
        this.gate = gate;

        this.figure = new Konva.Circle({
            x: x,
            y: y,
            radius: 4,
            fill: 'grey',
        });

        this.figure.on('mouseover', () => { 
            document.body.style.cursor = 'pointer';
            this.figure.radius(8);
            this.figure.fill('blue');
        });

        this.figure.on('mouseout', () => {
            document.body.style.cursor = 'default';
            this.figure.radius(4);
            this.figure.fill('grey');
        });

        this.figure.on('click', (e) => {
            if (!GUIManager.lastClickedInstance) {
                return;
            }
    
            if (!GUIManager.lastClickedInstance.drawing) {
                return;
            }
            GUIManager.lastClickedInstance.drawing = false
            const origin = GUIManager.lastClickedInstance.gate;
            const target = this.gate;
            new Wire(origin, target, this.name, origin.eventEmitter)
        })

    }
}


class Output {
    constructor(gate, element) {

        this.gate = gate;
        this.element = element;

        this.figure = new Konva.Circle({
            x: 50,
            y: 20,
            radius: 4,
            fill: 'grey',
        });

        this.figure.on('mouseover', () => { 
            document.body.style.cursor = 'pointer';
            this.figure.radius(8);
            this.figure.fill('blue');
        });
    
        this.figure.on('mouseout', () => {
            document.body.style.cursor = 'default';
            this.figure.radius(4);
            this.figure.fill('grey');
        });

        let line;
        let points = [];
        let lastPoint;

        this.figure.on('click', (e) => {

            if (this.element.drawing == true) {
                return;
            }
    
            GUIManager.lastClickedInstance = this.element;
            this.element.drawing = true;
            points = [this.figure.getAbsolutePosition().x, this.figure.getAbsolutePosition().y]; // Comenzar en el primer círculo
            lastPoint = { x: this.figure.getAbsolutePosition().x, y: this.figure.getAbsolutePosition().y };
    
            // Crear la línea
            line = new Konva.Line({
                points: points,
                stroke: '#264653',
                strokeWidth: 1,
                lineJoin: 'round',
            });
            layer.add(line);
            layer.draw();
        });


        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && element.drawing) {
                // Cancelar el dibujo de la línea
                element.drawing = false;
                if (line) {
                    line.destroy();  // Eliminar la línea de la capa
                    layer.draw();    // Redibujar la capa
                }
            }
        });
    
    
        this.element.layer.getStage().on('click', (e) => {
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
            this.element.layer.draw();
        });
    
    
        this.element.layer.getStage().on('mousemove', (e) => {
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
            this.element.layer.draw();
        });
    }
}



const addLedInterfaceStrategy = element => {
    const inputA = new Input('a', element.gate, 18, 44);
    element.group.add(inputA.figure);
    element.figure.on('click', e => console.log(element.gate.id))
}


const addSwitchInterfaceStrategy = element => {

    element.figure.on('click', e => {
        element.gate.a = !element.gate.a;
    })

    element.figure.on('mouseover', e => {
        document.body.style.cursor = 'pointer';
    })

    element.figure.on('mouseout', e => {
        document.body.style.cursor = 'default';
    })

    const output = new Output(element.gate, element);
    element.group.add(output.figure);
}



const addDoubleGateInterfaceStrategy = element => {

    const inputA = new Input('a', element.gate, 0, 10);
    const inputB = new Input('b', element.gate, 0, 30);

    element.group.add(inputA.figure);
    element.group.add(inputB.figure);

    const output = new Output(element.gate, element);
    element.group.add(output.figure);
}