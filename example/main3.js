import { Gamepad } from "../src/gamepad3.js";
import { xboxMapping, rightMapping, leftMapping, remoteMapping } from "../src/gamepadMapping.js";

export const xboxMappingFirefox = {
    buttons: {
        A: 0,
        B: 1,
        X: 3,
        Y: 2,

        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,

        VIEW: 8,
        MENU: 9,

        LJB: 10,
        RJB: 11,

        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 }
    }
};

const gamepadInfo = {
    'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 02dd)': {
        mapping: xboxMapping
    },
    '045e-02dd-Microsoft X-Box One pad (Firmware 2015)': {
        mapping: xboxMappingFirefox
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


const g = new Gamepad(gamepadInfo)

const output = document.getElementById('output');
console.log(output);

// let count = 0;
g.addEventListener(Gamepad.CONNECTED, e => {
    console.log('---- Gamepad.CONNECTED');

    // e.target // the one connected
    // e.target.id // uuid
    // e.target.name = 'control' + count++
})

g.addEventListener(Gamepad.DISCONNECTED, e => {
    console.log('---- Gamepad.DISCONNECTED');
    e.target // the one disconnected
})


function update() {
    requestAnimationFrame(update);

    output.innerText = '';
    g.update(gamepads => {
        const { control0 } = gamepads;

        if (control0) {
            const { buttons } = control0;
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
                control0.vibrate(100)
            }

            if (Y.pressed) {
                output.innerText += `Y PRESSED ${Y.id}\n`
            }

            if (X.pressed) {
                output.innerText += `X PRESSED ${X.id}\n`
            }

            if (LB.pressed) {
                output.innerText += 'LB PRESSED\n'
            }
            if (RB.pressed) {
                output.innerText += 'RB PRESSED\n'
            }
            if (LT.pressed) {
                output.innerText += 'LT PRESSED\n'
                control0.vibrate(100, LT.value)
            }
            if (RT.pressed) {
                output.innerText += 'RT PRESSED\n'
                control0.vibrate(100, RT.value)
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


    })

    // g.gamepads.control0.A.pressed

}

update()