import { Gamepad } from "../src/gamepad2.js";
import { xboxMapping, rightMapping, leftMapping, remoteMapping } from "../src/gamepadMapping2.js";



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

gamepad.addEventListener(Gamepad.PRESSED, e => {
    console.log('---- PRESSED');

})


let vibrates = false
function update() {
    requestAnimationFrame(update);
    gamepad.update(gamepads => {
        // console.log(e);

        const { left, right, standard:xbox, remote } = gamepads;


        if (xbox) {
            const buttons = xbox.buttons;
            // console.log(buttons);

            if (buttons.A.pressed) {
                // Fire the XBOX haptic vibration
                // xbox.haptics[1].pulse(1, 100);
                console.log(xbox.haptics);

                console.log('---- A PRESSED');

                if(!vibrates){
                    vibrates = true;
                    xbox.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 2000,
                        weakMagnitude: .1,
                        strongMagnitude: 1.0,
                    }).then(() => {
                        setTimeout(() => {
                            console.log("Vibration ended!");
                            // Do something here...
                            vibrates = false
                        }, 2000); // Match the `duration` above
                    });
                }

            }

            if (buttons.Y.pressed) {
                console.log('---- Y PRESSED');
            }
        }








    });
}
update();

