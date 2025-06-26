import { Button, Control, GamepadJS } from '../src/gamepad.js';
import { gamepadInfo } from '../src/gamepadMapping.js';



const g = new GamepadJS(gamepadInfo)

const output = document.getElementById('output');
console.log(output);

g.onConnected(e => {
    console.log('---- Gamepad.CONNECTED', e);

    /** @type {Control} */
    const control0 = e.detail
    console.log(control0.buttons)
    const { A, RJX } = control0.buttons;
    console.log(A);

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
})

g.onDisconnected(e => {
    console.log('---- Gamepad.DISCONNECTED');
})

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
                output.innerText += `Y PRESSED ${Y.id}\n`
            }

            if (X.touched) {
                output.innerText += `X PRESSED ${X.id}\n`
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

            if (LJX.touched) {
                console.log(LJX);
                output.innerText += 'LJX PRESSED\n'
            }
            if (RJX.touched) {
                console.log(RJX);
                output.innerText += 'RJX PRESSED\n'
            }
        }
    })
}

update()
