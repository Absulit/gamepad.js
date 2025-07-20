# gamepad.js

![static content to pages](https://github.com/absulit/gamepad.js/actions/workflows/static.yml/badge.svg)

Custom implementation (wrapper) of the Gamepad API for ~~VR and~~ gamepads.

First version of the library from 2017, refactored in 2025.

Works with XBOX and Logitech controllers. I have to test more devices. I will update here when I do so. Or test and [open an issue with a video recording of the tested device.](https://github.com/Absulit/gamepad.js/issues)

# Install

### cdn

```
https://cdn.jsdelivr.net/npm/@absulit/gamepad.js@<version>/build/gamepad.min.js

https://cdn.jsdelivr.net/npm/@absulit/gamepad.js@<version>/build/gamepad.module.js
```

### npm
```sh
npm i @absulit/gamepad.js
```
### bun
```sh
bunx jsr add @absulit/gamepadjs
```

# Example:

### Live examples here:
- [Test control buttons](https://absulit.github.io/gamepad.js/example/base/)

- [Test with a 3d character](https://absulit.github.io/gamepad.js/example/character/)

- [Test with 2 controls](https://absulit.github.io/gamepad.js/example/controls/)


```html
<!-- From example/base/index.html -->

<script type="importmap">
    {
        "imports": {
            "gamepad": "https://cdn.jsdelivr.net/npm/@absulit/gamepad.js@<version>/build/gamepad.min.js",
        }
    }
</script>
```

```javascript
// From example/base/main.js

import { Button, Control, GamepadJS, gamepadInfo } from 'gamepad';

// if no gamepadInfo is set it defaults to one of the controllers
const g = new GamepadJS(gamepadInfo)


g.onConnected(e => {
    console.log('---- Gamepad.CONNECTED', e);

    /** @type {Control} */
    const control = e.detail
    console.log(control.buttons)
    const { A, RJX } = control.buttons;

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

g.onDisconnected(e => {
    console.log('---- Gamepad.DISCONNECTED');
})

function update() {
    requestAnimationFrame(update);

    output.innerText = '';
    g.update(controls => {
        // Controls are named after the index when they are added,
        // it also depends on how many the browser allows (Chrome has 4 slots)
        const { control0 } = controls;

        // `touched` property in control verifies if a button has been clicked on it
        // this to distinguish it from other controls
        if (control0?.touched) {
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



// This is old code I need to review. Leaving as a placeholder for now.

// Threejs Mesh called handLeft and handRight for the Touch Controllers hands
// handLeft.position.fromArray(left.pose.position);
// handLeft.quaternion.fromArray( left.pose.orientation );
// handRight.position.fromArray(right.pose.position);
// handRight.quaternion.fromArray(right.pose.orientation);

```

## example assets

Gamepad assets from the example directory from kenney.nl
[input prompts pixel](https://kenney.nl/assets/input-prompts-pixel-16)
Created/distributed by Kenney ([www.kenney.nl](www.kenney.nl))
License: [(Creative Commons Zero, CC0)](https://creativecommons.org/publicdomain/zero/1.0/)


Sub asset made by [swonky](https://opengameart.org/users/zwonky):
[submarines](https://opengameart.org/content/submarines-in-arne16)

## bundle and minification

```sh
# run script to build es6 module and min
sh build.sh
```
