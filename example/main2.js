import { Gamepad } from "../src/gamepad2.js";
import { gamepadInfo } from "../src/gamepadMapping2.js";





const gamepad = new Gamepad(gamepadInfo)

gamepad.addEventListener(Gamepad.PRESSED, e => {
    console.log('---- PRESSED');

})



function update() {
    requestAnimationFrame(update);
    gamepad.update();
}
update();

