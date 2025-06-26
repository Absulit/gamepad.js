# gamepad.js
Custom implementation (wrapper) of the Gamepad API for VR and gamepads.

First version of the library from 2017, refactored in 2025.

Works with XBOX controllers. I have to test more devices. I will update here when I do so.


# Example:

```javascript
// from example.main.js

import { Button, Control, GamepadJS } from '../src/gamepad.js';
import { gamepadInfo } from '../src/gamepadMapping.js';

// if no gamepadInfo is set it defaults to one of the controllers
const g = new GamepadJS(gamepadInfo)


g.addEventListener(GamepadJS.CONNECTED, e => {
    console.log('---- Gamepad.CONNECTED', e);

    /** @type {Control} */
    const control0 = e.detail
    console.log(control0.buttons)
    const { A, RJX } = control0.buttons;

    A.addEventListener(Button.PUSHED, e => {
        console.log('A - PUSHED');
    })

    // syntactic sugar
    A.onPushed(e => {
        console.log('A - PUSHED 2', e);
    })

    A.addEventListener(Button.RELEASED, e => {
        console.log('A - RELEASED');
    })
})

g.addEventListener(GamepadJS.DISCONNECTED, e => {
    console.log('---- Gamepad.DISCONNECTED');
})

function update() {
    requestAnimationFrame(update);

    output.innerText = '';
    g.update(controls => {
        // Controls are named after the index when they are added,
        // it also depends on how many the browser allows (Chrome has 4 slots)
        const { control0 } = controls;

        if (control0) {
            // the control has a list of buttons and axes, but all listed as buttons
            const { buttons } = control0;
            // the names of the buttons are based on the mapping (see gamepadMapping.js)
            const { A, B, X, Y, LB, RB, LT, RT, VIEW, MENU } = buttons;
            const { LJB, RJB, UP, DOWN, LEFT, RIGHT } = buttons;
            // joyticks are returned in `buttons`
            const { LJX, RJX } = buttons;

            // a button has a `touched` property, if true it has been touched
            if (A.touched) {
                console.log('A PRESSED')
            }

            if (B.touched) {
                console.log('B PRESSED')
            }

            // you can detect two or more buttons touched
            if (A.touched && B.touched) {
                // you can vibrate the control an amount of time
                control0.vibrate(100)
            }

            // triggers have a value property with the amount pressed
            if (RT.touched) {
                // you can vibrate the control based on the trigger value
                control0.vibrate(100, RT.value)
            }

            if (RJX.touched) {
                // Joysticks have a rotation angle
                // and the amount per axis
                console.log(RJX.angle);
                console.log(RJX.x);
                console.log(RJX.y);
            }
        }
    })
}

update()



// Threejs Mesh called handLeft and handRight for the Touch Controllers hands
// This is old code I need to review. Leaving as a placeholder for now.
// handLeft.position.fromArray(left.pose.position);
// handLeft.quaternion.fromArray( left.pose.orientation );
// handRight.position.fromArray(right.pose.position);
// handRight.quaternion.fromArray(right.pose.orientation);

```
