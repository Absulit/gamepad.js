import { Button, Control, GamepadJS, TAU } from '../src/gamepad.js';
import { gamepadInfo } from '../src/gamepadMapping.js';
import { imgs } from './imgs.js';


// minified
// import { Button, Control, GamepadJS, gamepadInfo } from '../build/gamepad.min.js';



const g = new GamepadJS(gamepadInfo)

const output = document.getElementById('output');
const arrowsEl = document.getElementById('arrows');
const viewEl = document.getElementById('view');
const menuEl = document.getElementById('menu');
const joystickLeftEl = document.getElementById('joystickleft');
const joystickRightEl = document.getElementById('joystickright');


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

g.onConnected(e => {
    console.log('---- Gamepad.CONNECTED', e);

    /** @type {Control} */
    const control0 = e.detail
    const { A, B, X, Y, RJX } = control0.buttons;
    const { LEFT, RIGHT, UP, DOWN } = control0.buttons;
    const { VIEW, MENU} = control0.buttons;
    const { LT, RT, LB, RB} = control0.buttons;

    A.addEventListener(Button.PUSHED, e => {
        console.log('A - PUSHED');
    })

    A.onPushed(e => {
        console.log('A - PUSHED 2', e);
    })

    A.addEventListener(Button.RELEASED, e => {
        console.log('A - RELEASED');
    })

    RJX.addEventListener(Button.PUSHED, e => {
        console.log('RJX - PUSHED');
    })

    RJX.addEventListener(Button.RELEASED, e => {
        console.log('RJX - RELEASED');
    })

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

})

g.onDisconnected(e => {
    console.log('---- Gamepad.DISCONNECTED');
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

            if (A.touched && B.touched) {
                control0.vibrate(100)
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
                output.innerText += 'LT PRESSED\n'
                control0.vibrate(100, LT.value)
            }
            if (RT.touched) {
                output.innerText += 'RT PRESSED\n'
                control0.vibrate(100, RT.value)
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
                output.innerText += `RJX PRESSED ${RJX.angle}\n`

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
                if ( (QUARTER * 4) > percent && percent > (QUARTER * 3)) {
                    joystickRightEl.src = imgs.JOYSTICK.RIGHT
                }

            }

            joystickLeftEl.src = imgs.JOYSTICK.NONE
            if (LJX.touched) {
                output.innerText += `LJX PRESSED ${LJX.angle}\n`

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
                if ( (QUARTER * 4) > percent && percent > (QUARTER * 3)) {
                    joystickLeftEl.src = imgs.JOYSTICK.RIGHT
                }

            }

        }
    })
}

update()
