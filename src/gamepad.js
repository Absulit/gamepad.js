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
 * Button
 */

export class Button extends EventTarget {
    static PUSHED = 'PUSHED';
    static RELEASED = 'RELEASED';
    #pushed = false
    #released = true

    constructor() {
        super()
    }

    /**
     * To copy properties from the Gamepad API button
     * @param {Object} v
     */
    setProperties(v) {
        for (let p in v) {
            this[p] = v[p]
        }
    }

    dispatchEventIfPushed() {
        if (this.touched && !this.#pushed) {
            this.dispatchEvent(new Event(Button.PUSHED));
            this.#pushed = true;
            this.#released = false;
        }
        if (!this.touched && !this.#released) {
            this.dispatchEvent(new Event(Button.RELEASED));
            this.#pushed = false;
            this.#released = true;
        }
    }
}

/**
 * Control
 */
export class Control extends EventTarget {
    #gamepad = null;
    #index = null;
    #buttons = {}
    constructor(gamepad, index) {
        super()
        this.#gamepad = gamepad;
        this.#index = index;
    }

    /**
     * @param {Object} v
     */
    set gamepad(v) {
        this.#gamepad = v;
    }

    get index() {
        return this.#index
    }

    get buttons() {
        return this.#buttons;
    }

    vibrate(duration, intensity) {
        if (this.#gamepad.vibrates) {
            return
        }
        intensity ||= 1;
        this.#gamepad.vibrates = true
        this.#gamepad.vibrationActuator?.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: .1,
            strongMagnitude: intensity,
        }).then(() => {
            this.#gamepad.vibrates = false
        });
    }
}

/**
 * Gamepad
 */

export class Gamepad extends EventTarget {
    static instance;
    static CONNECTED = 'CONNECTED';
    static DISCONNECTED = 'DISCONNECTED';
    #gamepadInfo = null;
    #controls = {};
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
        console.log('---- #onGamepadConnected', gamepad.constructor.name);
        const control = this.#controls[`control${index}`] = new Control(gamepad, index)//{ index, buttons: {} };

        const mapping = this.#gamepadInfo[gamepad.id]?.mapping;
        for (let buttonName in mapping.buttons) {
            control.buttons[buttonName] = new Button();
        }
        for (let buttonName in mapping.axes) {
            control.buttons[buttonName] = new Button();
        }

        this.dispatchEvent(new CustomEvent(Gamepad.CONNECTED, { detail: control }));
    }

    #onGamepadDisconnected = e => {
        console.log('---- #onGamepadDisconnected', e.gamepad.index, e.gamepad.id);
        this.#controls[`control${e.gamepad.index}`] = null;
        this.dispatchEvent(new Event(Gamepad.DISCONNECTED));
    }

    #getGamepads() {
        return navigator.getGamepads();
    }

    #isObject = v => {
        return typeof v === 'object' && v !== null;
    }

    update = f => {
        const gamepads = this.#getGamepads();
        for (let key in this.#controls) {
            const control = this.#controls[key];
            const gamepad = gamepads[control?.index];

            const mapping = this.#gamepadInfo[gamepad?.id]?.mapping;

            if (!mapping) {
                return
            }

            control.pose = gamepad.pose;

            for (let buttonName in mapping.buttons) {
                const gamepadButton = gamepad.buttons[mapping.buttons[buttonName]];
                const button = control.buttons[buttonName];
                button.setProperties(gamepadButton)
                button.dispatchEventIfPushed();
            }

            for (let buttonName in mapping.axes) {
                const mappingButton = mapping.axes[buttonName];
                const isObject = this.#isObject(mappingButton);

                let button = control.buttons[buttonName];

                if (isObject) {
                    button = control.buttons[buttonName];
                    button.setProperties({ x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y] })
                    button.touched = (Math.abs(button.x) > .1) || (Math.abs(button.y) > .1);
                    button.angle = Math.atan2(button.y, button.x);
                } else {
                    const value = gamepad.axes[mappingButton];
                    button = control.buttons[buttonName]
                    button.lastValue = button.value;
                    button.value = value;


                    button.touched = -.9 < value;
                    // to solve a bug if the value starts in zero
                    if (button.lastValue == button.value && button.value == 0) {
                        button.touched = false;
                    }
                }
                button.dispatchEventIfPushed();
            }
        }

        f(this.#controls)
    }
}
