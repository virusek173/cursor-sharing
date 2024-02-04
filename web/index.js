let socket = null;
let throttleTime = null; 

const websocketConnect = () => {
    socket = new WebSocket('ws://localhost:7071');

    socket.addEventListener("message", (event) => {
        const { color, cursorCoords, sender } = JSON.parse(event.data)
        const cursor = getOrCreateCursor(color, sender)
        
        moveCursorWithCoords(cursor, cursorCoords)
    })
}

const moveCursorWithCoords = (cursor, cursorCoords) => {
    const { x, y } = cursorCoords;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
}


const getOrCreateCursor = (color, sender) => {
    const existingCursor = document.querySelector(`[data-sender='${sender}']`);
    if (existingCursor) {
        return existingCursor;
    }

    const template = document.getElementById('cursor');
    const cursor = template.content.firstElementChild.cloneNode(true);
    const svgPath = cursor.getElementsByTagName('path')[0];

    cursor.setAttribute("data-sender", sender);
    cursor.style.height = '25px';
    cursor.style.position = 'absolute';
    svgPath.setAttribute('fill', `hsl(${color}, 50%, 50%)`);
    document.body.appendChild(cursor);

    return cursor;
} 

const onMouseMove = (event) => {
    const cursorCoords = { x: event.clientX, y: event.clientY };
    console.log(cursorCoords, new Date());
    socket.send(JSON.stringify({ cursorCoords }));
}

const throttle = (func, time) => {
    if (!throttleTime) {
        throttleTime = new Date();
    }
    const timeNow = new Date();
    if (timeNow - throttleTime > time) {
        throttleTime = null;
        func();
    }
}

document.onmousemove = (event) => throttle(() => onMouseMove(event), 1000/60)
