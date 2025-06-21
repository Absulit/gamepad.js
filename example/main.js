import { Gamepad } from "../src/gamepad.js";
import { xboxMapping, rightMapping, leftMapping, remoteMapping } from "../src/gamepadMapping.js";



const gamepadInfo = {
    standard: {
        mapping: xboxMapping
    },
    right: {
        mapping: rightMapping
    },
    left: {
        mapping: leftMapping
    },
    remote: {
        mapping: remoteMapping
    }
};

const gamepad = new Gamepad(gamepadInfo)
const output = document.getElementById('output');


function update() {
    requestAnimationFrame(update);
    output.innerText = '';
    gamepad.update(gamepads => {
        const { left, right, standard: xbox, remote } = gamepads;

        if (xbox) {
            const { buttons } = xbox;
            const { A, B, X, Y, LB, RB, LT, RT, VIEW, MENU } = buttons;
            const { LJB, RJB, UP, DOWN, LEFT, RIGHT } = buttons;
            const { LJX, RJX } = buttons;

            if (A.pressed) {
                output.innerText += 'A PRESSED\n'
            }

            if (B.pressed) {
                output.innerText += 'B PRESSED\n'
            }

            if (A.pressed && B.pressed) {
                xbox.vibrate(100)
            }

            if (Y.pressed) {
                output.innerText += 'Y PRESSED\n'
            }

            if (X.pressed) {
                output.innerText += 'X PRESSED\n'
            }

            if (LB.pressed) {
                output.innerText += 'LB PRESSED\n'
            }
            if (RB.pressed) {
                output.innerText += 'RB PRESSED\n'
            }
            if (LT.pressed) {
                output.innerText += 'LT PRESSED\n'
                xbox.vibrate(100, LT.value)
            }
            if (RT.pressed) {
                output.innerText += 'RT PRESSED\n'
                xbox.vibrate(100, RT.value)
            }
            if (VIEW.pressed) {
                output.innerText += 'VIEW PRESSED\n'
            }
            if (MENU.pressed) {
                output.innerText += 'MENU PRESSED\n'
            }
            // LJB, RJB, UP, DOWN, LEFT, RIGHT
            if (LJB.pressed) {
                output.innerText += 'LJB PRESSED\n'
            }

            if (RJB.pressed) {
                output.innerText += 'RJB PRESSED\n'
            }

            if (UP.pressed) {
                output.innerText += 'UP PRESSED\n'
            }

            if (DOWN.pressed) {
                output.innerText += 'DOWN PRESSED\n'
            }

            if (LEFT.pressed) {
                output.innerText += 'LEFT PRESSED\n'
            }

            if (RIGHT.pressed) {
                output.innerText += 'RIGHT PRESSED\n'
            }

            // const {LJX, RJX} = axes;
            if (LJX.pressed) {
                output.innerText += 'LJX PRESSED\n'
            }
            if (RJX.pressed) {
                output.innerText += 'RJX PRESSED\n'
            }



        }

    });
}
update();
