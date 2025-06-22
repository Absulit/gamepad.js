/**
 * @author Sebastián Sanabria Díaz
 * Gamepad controls loosely based on this MDN link:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://developers.google.com/web/fundamentals/vr/adding-input-to-a-webvr-scene/

    Haptics:
    https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
    view-source:https://toji.github.io/webvr-samples/XX-vr-controllers.html
 * chrome://flags
 */

/**
 * Gamepad
 */
export class Gamepad extends EventTarget {
    static instance;
    static PRESSED = 'PRESSED';
    static CONNECTED = 'CONNECTED';
    static DISCONNECTED = 'DISCONNECTED';
    #gamepadInfo = null;
    #formattedGamepads = {};
    #buttons = {};
    #gamepads = {}
    constructor(gamepadInfo) {
        super();
        if (Gamepad.instance) {
            return Gamepad.instance;
        }
        Gamepad.instance = this;
        this.#gamepadInfo = gamepadInfo;

        //https://twitter.com/Tojiro/status/807758580791197696
        //console.log(navigator.getVRDisplays() );
        window.addEventListener('gamepadconnected', this.#onGamepadConnected);
        window.addEventListener('gamepaddisconnected', this.#onGamepadDisconnected);
    }

    #onGamepadConnected = e => {
        const { gamepad } = e;
        const { index, id } = gamepad;
        console.log('---- #onGamepadConnected', index, id);
        console.log('---- #onGamepadConnected', gamepad);
        const fg = this.#formattedGamepads[`control${index}`] = { index };

        fg.haptics = gamepad.hapticActuators;
        fg.vibrationActuator = gamepad.vibrationActuator;
        fg.vibrate = (d, v) => this.#vibrate(d, v, gamepad);


        this.dispatchEvent(new Event(Gamepad.CONNECTED));
    }

    #onGamepadDisconnected = e => {
        console.log('---- #onGamepadDisconnected', e.gamepad.index, e.gamepad.id);
        this.#formattedGamepads[`control${e.gamepad.index}`] = null;
        this.dispatchEvent(new Event(Gamepad.DISCONNECTED));
    }

    #getGamepads() {
        return navigator.getGamepads();
    }

    #findGamepad(id, gamepads) {
        return gamepads.find(gp => gp?.id.toLowerCase().indexOf(id) !== -1)
    }

    update = f => {

        const gamepads = this.#getGamepads();
        for (let key in this.#formattedGamepads) {
            const fg = this.#formattedGamepads[key];
            const gamepad = gamepads[fg.index];
            const mapping = this.#gamepadInfo[gamepad.id]?.mapping;

            if(!mapping){
                return
            }

            // console.log(gamepad.buttons.filter(b => b.pressed));
            // console.log(gamepad.axes);


            fg.pose = gamepad.pose;

            for (let buttonName in mapping.buttons) {
                this.#buttons[buttonName] = gamepad.buttons[mapping.buttons[buttonName]];
            }

            for (let buttonName in mapping.axes) {
                const mappingButton = mapping.axes[buttonName];
                const button = this.#buttons[buttonName] = { x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y] };

                button.pressed = (Math.abs(button.x) > .1) || (Math.abs(button.y) > .1);
                button.angle = Math.atan2(button.y, button.x);
            }

            fg.buttons = this.#buttons;
        }

        f(this.#formattedGamepads)

    }

    #vibrate(duration, intensity, gamepad) {
        if (gamepad.vibrates) {
            return
        }
        intensity ||= 1;
        gamepad.vibrates = true
        gamepad.vibrationActuator?.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: .1,
            strongMagnitude: intensity,
        }).then(() => {
            gamepad.vibrates = false
        });
    }

}
