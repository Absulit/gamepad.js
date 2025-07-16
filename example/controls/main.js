import { Button, Control, GamepadJS, TAU } from 'gamepad';
import { gamepadInfo } from 'gamepadMapping';


// minified
// import { Button, Control, GamepadJS, gamepadInfo } from 'gamepadmin';

const g = new GamepadJS()
g.debug = true;
// g.logKeys = true; // to log keys if a button is not showing up

const connectedMessage0 = document.getElementById('connectedmsg0');
const connectedMessage1 = document.getElementById('connectedmsg1');
const connectedMessages = [connectedMessage0, connectedMessage1];

const cube0 = document.getElementById('cube0');
const cube1 = document.getElementById('cube1');
const cubes = [cube0, cube1];


/**
 * To show if the device is connected on the screen
 * @param {boolean} connected
 */
function setConnectedMessage(connected, deviceName, connectedMessage) {
    connectedMessage.innerText = 'device disconnected';
    connectedMessage.classList.remove('connected');
    if (connected) {
        connectedMessage.innerText = `device connected: ${deviceName}`;
        connectedMessage.classList.add('connected');
    }
}

setConnectedMessage(false, null, connectedMessage0);
setConnectedMessage(false, null, connectedMessage1);

g.onConnected(e => {
    console.log('---- Gamepad.CONNECTED', e);


    /** @type {Control} */
    const control = e.detail;
    setConnectedMessage(true, control.id, connectedMessages[control.index]);
    const { A, B, X, Y } = control.buttons;
    const { LEFT, RIGHT, UP, DOWN } = control.buttons;
    const { VIEW, MENU } = control.buttons;
    const { LT, RT, LB, RB } = control.buttons;


})

g.onDisconnected(e => {
    /** @type {Control} */
    const control = e.detail;
    console.log('---- Gamepad.DISCONNECTED', control);
    setConnectedMessage(false, null, connectedMessages[control.index]);
})

function moveCube(cube, LJX, RT, RB) {
    let { left, top } = getComputedStyle(cube0);

    left = parseFloat(left) + LJX.x * LJX.distance * 2 * (RT.value * 10 || 1) * (RB.touched * .1 || 1);
    top = parseFloat(top) + LJX.y * LJX.distance * 2 * (RT.value * 10 || 1) * (RB.touched * .1 || 1);

    cube.style.left = `${left}px`;
    cube.style.top = `${top}px`;
}


function update() {
    requestAnimationFrame(update);

    g.update(controls => {
        /**@type {Control} */
        const { control0, control1 } = controls;

        if (control0?.touched) {
            const { LJX, RT, RB } = control0.buttons;
            if (LJX.touched) {
                moveCube(cube0, LJX, RT, RB);
            }
        }

       if (control1?.touched) {
            const { LJX, RT, RB } = control1.buttons;
            if (LJX.touched) {
                moveCube(cube1, LJX, RT, RB);
            }
        }

    })
}

update()
