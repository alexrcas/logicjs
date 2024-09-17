const addLedInterfaceStrategy = element => {

    element.guiA = new Konva.Circle({
        x: 18,
        y: 44,
        radius: 4,
        fill: 'grey',
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
        fill: 'grey',
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
        fill: 'grey',
    });

    element.guiB = new Konva.Circle({
        x: 0,
        y: 30,
        radius: 4,
        fill: 'grey',
    });

    element.group.add(element.guiA);
    element.group.add(element.guiB);

    element.guiS = new Konva.Circle({
        x: 50,
        y: 20,
        radius: 4,
        fill: 'grey',
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