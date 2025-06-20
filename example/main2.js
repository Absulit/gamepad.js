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
            const {A, B, X, Y, LB, RB, LT, RT, VIEW, MENU} = buttons;
            const {LJB, RJB, UP, DOWN, LEFT, RIGHT} = buttons;
            const {LJX, RJX} = buttons;


            if (A.pressed) {
                // Fire the XBOX haptic vibration
                // xbox.haptics[1].pulse(1, 100);
                // console.log(xbox.haptics);

                console.log('---- A PRESSED');

                if(!vibrates){
                    vibrates = true;
                    // xbox.vibrationActuator.playEffect("dual-rumble", {
                    //     startDelay: 0,
                    //     duration: 2000,
                    //     weakMagnitude: .1,
                    //     strongMagnitude: 1.0,
                    // }).then(() => {
                    //     setTimeout(() => {
                    //         console.log("Vibration ended!");
                    //         // Do something here...
                    //         vibrates = false
                    //     }, 2000); // Match the `duration` above
                    // });
                }

            }

            if (Y.pressed) {
                console.log('---- Y PRESSED');
            }

            if(B.pressed){
                console.log('---- B PRESSED');
            }

            if(X.pressed){
                console.log('---- X PRESSED');
            }

            if(LB.pressed){
                console.log('---- LB PRESSED');
            }
            if(RB.pressed){
                console.log('---- RB PRESSED');
            }
            if(LT.pressed){
                console.log('---- LT PRESSED');
            }
            if(RT.pressed){
                console.log('---- RT PRESSED');
            }
            if(VIEW.pressed){
                console.log('---- VIEW PRESSED');
            }
            if(MENU.pressed){
                console.log('---- MENU PRESSED');
            }
            // LJB, RJB, UP, DOWN, LEFT, RIGHT
            if(LJB.pressed){
                console.log('---- LJB PRESSED');
            }

            if(RJB.pressed){
                console.log('---- RJB PRESSED');
            }

            if(UP.pressed){
                console.log('---- UP PRESSED');
            }

            if(DOWN.pressed){
                console.log('---- DOWN PRESSED');
            }

            if(LEFT.pressed){
                console.log('---- LEFT PRESSED');
            }

            if(RIGHT.pressed){
                console.log('---- RIGHT PRESSED');
            }

            // const {LJX, RJX} = axes;
            if(LJX.pressed){
                console.log('---- LJX PRESSED', LJX);
            }
            if(RJX.pressed){
                console.log('---- RJX PRESSED', RJX);
            }



        }








    });
}
update();

