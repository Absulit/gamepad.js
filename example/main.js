import { Button, Control, GamepadJS, TAU } from '../src/gamepad.js';
import { gamepadInfo } from '../src/gamepadMapping.js';
import { imgs } from './imgs.js';


// minified
// import { Button, Control, GamepadJS, gamepadInfo } from '../build/gamepad.min.js';

const g = new GamepadJS()
g.debug = true;
g.logKeys = true; // to log keys if a button is not showing up

const output = document.getElementById('output');
const history = document.getElementById('history');
const connectedMessage = document.getElementById('connectedmsg');
const arrowsEl = document.getElementById('arrows');
const viewEl = document.getElementById('view');
const menuEl = document.getElementById('menu');
const joystickLeftEl = document.getElementById('joystickleft');
const joystickRightEl = document.getElementById('joystickright');
const sub = document.getElementById('sub');

sub.rotation = 0; // rotation holder


function addHistory(v) {
    history.innerText = v + '\n' + history.innerText;
}

const b = document.getElementById('buttons');
const buttonsEl = {
    A: b.querySelector('#a'),
    B: b.querySelector('#b'),
    X: b.querySelector('#x'),
    Y: b.querySelector('#y'),
}

const t = document.getElementById('triggers');
const triggersEl = {
    LEFT: t.querySelector('#left'),
    RIGHT: t.querySelector('#right'),
}

const tb = document.getElementById('topbuttons');
const topButtonsEl = {
    LEFT: tb.querySelector('#left'),
    RIGHT: tb.querySelector('#right'),
}

/**
 * To show if the device is connected on the screen
 * @param {boolean} connected
 */
function setConnectedMessage(connected, deviceName) {
    connectedMessage.innerText = 'device disconnected';
    connectedMessage.classList.remove('connected');
    if (connected) {
        connectedMessage.innerText = `device connected: ${deviceName}`;
        connectedMessage.classList.add('connected');
    }
}

setConnectedMessage();

g.onConnected(e => {
    console.log('---- Gamepad.CONNECTED', e);


    /** @type {Control} */
    const control = e.detail
    setConnectedMessage(true, control.id);
    const { A, B, X, Y } = control.buttons;
    const { LEFT, RIGHT, UP, DOWN } = control.buttons;
    const { VIEW, MENU } = control.buttons;
    const { LT, RT, LB, RB } = control.buttons;

    for (let key in control.buttons) {
        const button = control.buttons[key];
        let index = button.index;
        if (typeof button.index === 'object') {
            const { x, y } = button.index;
            index = `{x:${x}, y:${y}}`;
        }
        button.onPushed(e => addHistory(`${button.name} - PUSHED, Index: ${index}`))
        button.onReleased(e => addHistory(`${button.name} - RELEASED`))
    }

    LEFT.onPushed(e => arrowsEl.src = imgs.LEFT);
    RIGHT.onPushed(e => arrowsEl.src = imgs.RIGHT);
    UP.onPushed(e => arrowsEl.src = imgs.UP);
    DOWN.onPushed(e => arrowsEl.src = imgs.DOWN);

    const onReleased = e => arrowsEl.src = imgs.NONE;

    LEFT.onReleased(onReleased);
    RIGHT.onReleased(onReleased);
    UP.onReleased(onReleased);
    DOWN.onReleased(onReleased);
    //

    A.onPushed(e => buttonsEl.A.src = imgs.A.PRESSED);
    B.onPushed(e => buttonsEl.B.src = imgs.B.PRESSED);
    X.onPushed(e => buttonsEl.X.src = imgs.X.PRESSED);
    Y.onPushed(e => buttonsEl.Y.src = imgs.Y.PRESSED);

    A.onReleased(e => buttonsEl.A.src = imgs.A.RELEASED);
    B.onReleased(e => buttonsEl.B.src = imgs.B.RELEASED);
    X.onReleased(e => buttonsEl.X.src = imgs.X.RELEASED);
    Y.onReleased(e => buttonsEl.Y.src = imgs.Y.RELEASED);

    // colors


    A.onPushed(e => sub.style.filter = `hue-rotate(55deg)`);
    B.onPushed(e => sub.style.filter = `hue-rotate(315deg)`);
    X.onPushed(e => sub.style.filter = `hue-rotate(170deg)`);
    Y.onPushed(e => sub.style.filter = `hue-rotate(10deg)`);

    const resetColor = e => sub.style.filter = '';

    A.onReleased(resetColor);
    B.onReleased(resetColor);
    X.onReleased(resetColor);
    Y.onReleased(resetColor);
    //

    VIEW.onPushed(e => viewEl.src = imgs.VIEW.PRESSED);
    VIEW.onReleased(e => viewEl.src = imgs.VIEW.RELEASED);

    MENU.onPushed(e => menuEl.src = imgs.MENU.PRESSED);
    MENU.onReleased(e => menuEl.src = imgs.MENU.RELEASED);

    LT.onPushed(e => triggersEl.LEFT.src = imgs.TRIGGERS.LEFT.PRESSED);
    LT.onReleased(e => triggersEl.LEFT.src = imgs.TRIGGERS.LEFT.RELEASED);
    RT.onPushed(e => triggersEl.RIGHT.src = imgs.TRIGGERS.RIGHT.PRESSED);
    RT.onReleased(e => triggersEl.RIGHT.src = imgs.TRIGGERS.RIGHT.RELEASED);

    LB.onPushed(e => topButtonsEl.LEFT.src = imgs.TOPBUTTONS.LEFT.PRESSED);
    LB.onReleased(e => topButtonsEl.LEFT.src = imgs.TOPBUTTONS.LEFT.RELEASED);
    RB.onPushed(e => topButtonsEl.RIGHT.src = imgs.TOPBUTTONS.RIGHT.PRESSED);
    RB.onReleased(e => topButtonsEl.RIGHT.src = imgs.TOPBUTTONS.RIGHT.RELEASED);

    const rect = connectedMessage.getBoundingClientRect();
    const { left, top } = rect
    sub.style.left = `${left}px`;
    sub.style.top = `${top - rect.height - sub.height * .5}px`;
    sub.classList.remove('hide');
})

g.onDisconnected(e => {
    console.log('---- Gamepad.DISCONNECTED');
    sub.classList.add('hide');
    setConnectedMessage();
})

const QUARTER = .25;
const OFFSET = 1 - (QUARTER * .5);

function update() {
    requestAnimationFrame(update);

    output.innerText = '';
    g.update(controls => {
        const { control0 } = controls;

        if (control0) {
            const { buttons } = control0;
            const { A, B, X, Y, LB, RB, LT, RT, VIEW, MENU } = buttons;
            const { LJB, RJB, UP, DOWN, LEFT, RIGHT } = buttons;
            const { LJX, RJX } = buttons;

            // arrowsEl.src = imgs.NONE;

            if (A.touched) {
                output.innerText += 'A PRESSED\n'
            }

            if (B.touched) {
                output.innerText += 'B PRESSED\n'
            }

            sub.shake = false;
            if (A.touched && B.touched) {
                control0.vibrate(100)
                sub.shake = true;
            }

            if (Y.touched) {
                output.innerText += `Y PRESSED\n`
            }

            if (X.touched) {
                output.innerText += `X PRESSED\n`
            }

            if (LB.touched) {
                output.innerText += 'LB PRESSED\n'
            }
            if (RB.touched) {
                output.innerText += 'RB PRESSED\n'
            }

            if (LT.touched) {
                output.innerText += `LT PRESSED\n\tValue: ${LT.value}\n`;
                control0.vibrate(100, LT.value)
                sub.shake = true;
            }
            if (RT.touched) {
                output.innerText += `RT PRESSED\n\tValue: ${RT.value}\n`;
                control0.vibrate(100, RT.value)
                sub.shake = true;
            }

            if (VIEW.touched) {
                output.innerText += 'VIEW PRESSED\n'
            }
            if (MENU.touched) {
                output.innerText += 'MENU PRESSED\n'
            }
            // LJB, RJB, UP, DOWN, LEFT, RIGHT
            if (LJB.touched) {
                output.innerText += 'LJB PRESSED\n'
            }

            if (RJB.touched) {
                output.innerText += 'RJB PRESSED\n'
            }

            if (UP.touched) {
                output.innerText += 'UP PRESSED\n'
            }

            if (DOWN.touched) {
                output.innerText += 'DOWN PRESSED\n'
            }

            if (LEFT.touched) {
                output.innerText += 'LEFT PRESSED\n'
            }

            if (RIGHT.touched) {
                output.innerText += 'RIGHT PRESSED\n'
            }

            // const {LJX, RJX} = axes;

            joystickRightEl.src = imgs.JOYSTICK.NONE
            if (RJX.touched) {
                output.innerText += `RJX PRESSED\n\tAngle: ${RJX.angle}\n\tDistance: ${RJX.distance}\n\tx: ${RJX.x}\n\ty: ${RJX.y}\n`

                const percent = (RJX.proportion + OFFSET) % 1;

                if (QUARTER > percent && percent > 0) {
                    joystickRightEl.src = imgs.JOYSTICK.UP
                }
                if ((QUARTER * 2) > percent && percent > QUARTER) {
                    joystickRightEl.src = imgs.JOYSTICK.LEFT
                }
                if ((QUARTER * 3) > percent && percent > (QUARTER * 2)) {
                    joystickRightEl.src = imgs.JOYSTICK.DOWN
                }
                if ((QUARTER * 4) > percent && percent > (QUARTER * 3)) {
                    joystickRightEl.src = imgs.JOYSTICK.RIGHT
                }
                sub.rotation = RJX.angle * (180 / Math.PI);

            }

            joystickLeftEl.src = imgs.JOYSTICK.NONE
            if (LJX.touched) {
                output.innerText += `LJX PRESSED\n\tAngle: ${LJX.angle}\n\tDistance: ${LJX.distance}\n\tx: ${LJX.x}\n\ty: ${LJX.y}\n`

                const percent = (LJX.proportion + OFFSET) % 1;

                if (QUARTER > percent && percent > 0) {
                    joystickLeftEl.src = imgs.JOYSTICK.UP
                }
                if ((QUARTER * 2) > percent && percent > QUARTER) {
                    joystickLeftEl.src = imgs.JOYSTICK.LEFT

                }
                if ((QUARTER * 3) > percent && percent > (QUARTER * 2)) {
                    joystickLeftEl.src = imgs.JOYSTICK.DOWN
                }
                if ((QUARTER * 4) > percent && percent > (QUARTER * 3)) {
                    joystickLeftEl.src = imgs.JOYSTICK.RIGHT
                }

                let { left, top } = getComputedStyle(sub)

                left = parseFloat(left) + LJX.x * LJX.distance * 2 * (RT.value * 10 || 1) * (RB.touched * .1 || 1);
                top = parseFloat(top) + LJX.y * LJX.distance * 2 * (RT.value * 10 || 1) * (RB.touched * .1 || 1);
                if (left < -sub.width) {
                    left = window.innerWidth;
                }
                if (left > (window.innerWidth + sub.width)) {
                    left = 0;
                }
                if (top > (window.innerHeight - sub.height)) {
                    top = window.innerHeight - sub.height
                    control0.vibrate(100, 1);
                    sub.shake = true;
                }
                if (top < 0) {
                    top = 0
                    control0.vibrate(100, 1);
                    sub.shake = true;
                }

                sub.style.left = `${left}px`;
                sub.style.top = `${top}px`;
            }

            sub.scale ||= 'scale(1, 1)';
            if (RJX.touched) {
                // flip sub going left or right
                sub.scale = 'scale(1, 1)';
                sub.classList.remove('right');
                if (RJX.x > 0) {
                    sub.classList.add('right');
                    sub.scale = 'scale(-1, 1)';
                }
            }

            let shake = ''
            if (sub.shake) {
                const x = Math.floor(Math.random() * 5);
                const y = Math.floor(Math.random() * 5);
                shake = `translate(${x}px, ${y}px)`;
            }
            sub.style.transform = `${shake} ${sub.scale}`;
        }
    })
}

update()
