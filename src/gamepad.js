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

import { xboxMapping } from './gamepadMapping.js';

export const TAU = Math.PI * 2;

/**
 * Button
 */

export class Button extends EventTarget {
    static PUSHED = 'PUSHED';
    static RELEASED = 'RELEASED';
    #pushed = false;
    #released = true;
    #name = null;
    #index = null;
    #debug = false;
    #angle = 0;
    #distance = 0;
    #proportion = 0;
    #touched = false;
    #value = 0;
    #lastValue = 0;

    /**
     *
     * @param {string} name
     * @param {Number} index
     */
    constructor(name, index) {
        super()
        this.#name = name;
        this.#index = index;
    }

    get name() {
        return this.#name;
    }

    get index() {
        return this.#index
    }

    /**
     * @param {boolean} v
     */
    set debug(v) {
        this.#debug = v;
    }

    /**
     * angle in radians
     * This is done by GamepadJS, you don't have to set it.
     */
    get angle() {
        return this.#angle;
    }


    /**
     * distance from the center of the joystick
     */
    get distance() {
        return this.#distance;
    }

    get proportion() {
        return this.#proportion;
    }

    get touched() {
        return this.#touched;
    }

    get value() {
        return this.#value
    }

    set value(v) {
        this.#lastValue = this.#value;
        this.#value = v;
        this.#touched = -.9 < v;
        // to solve a bug if the value starts in zero
        if (this.#lastValue === this.#value && this.#value === 0) {
            this.#touched = false;
        }
    }

    /**
     * To copy properties from the Gamepad API button
     * @param {Object} v
     */
    setProperties({ pressed, touched, value, x, y }) {
        this.pressed = pressed
        this.#touched = touched
        this.x = x;
        this.y = y;
        this.#value = value;
        if (this.x && this.y) {
            const { x, y } = this; // TODO replace with #x and #y
            this.#distance = Math.sqrt(x * x + y * y);
            this.#angle = Math.atan2(-y, x);
            this.#proportion = this.#angle / TAU;
            if (this.#angle < 0) this.#angle += TAU;

            this.#touched = (Math.abs(x) > .1) || (Math.abs(y) > .1);
        }
    }


    dispatchEventIfPushed() {
        if (this.touched && !this.#pushed) {
            this.dispatchEvent(new Event(Button.PUSHED));
            this.#pushed = true;
            this.#released = false;
            if (this.#debug) {
                let index = this.#index;
                if (typeof this.#index === 'object') {
                    const { x, y } = this.#index;
                    index = `{x:${x}, y:${y}}`;
                }
                console.log(`Button PUSHED: Name: ${this.#name}, Index: ${index}`);
            }
        }
        if (!this.touched && !this.#released) {
            this.dispatchEvent(new Event(Button.RELEASED));
            this.#pushed = false;
            this.#released = true;
        }
    }

    /**
     * Syntactic sugar for
     * `addEventListener(Button.PUSHED, f)`
     * @param {Function} f callback
     */
    onPushed(f) {
        this.addEventListener(Button.PUSHED, f);
    }

    /**
     * Syntactic sugar for
     * `addEventListener(Button.RELEASED, f)`
     * @param {Function} f callback
     */
    onReleased(f) {
        this.addEventListener(Button.RELEASED, f);
    }
}

/**
 * Control
 */
export class Control extends EventTarget {
    #gamepad = null;
    #index = null;
    /** @type {Object.<string, Button>} */
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

    /**
     * Vibrates the controller
     * @param {Number} duration
     * @param {Number} intensity
     */
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

    /**
     * Add an button with alias `name`
     * @param {string} name Name the button will be called on later
     * @param {Number} index button index from the Gamepad API
     */
    addButton(name, index) {
        this.#buttons[name] = new Button(name, index);
    }

    get hasVibrationActuator() {
        return !!this.#gamepad.vibrationActuator;
    }
}

/**
 * Gamepad
 */

export class GamepadJS extends EventTarget {
    static instance;
    static CONNECTED = 'CONNECTED';
    static DISCONNECTED = 'DISCONNECTED';
    /** @type {Object.<string, Object>} */
    #gamepadInfo = null;
    /** @type {Object.<string, Control>} */
    #controls = {};
    #mapping = null;
    #debug = false;
    /**
     *
     * @param {Object.<string, Object>|null} gamepadInfo
     * @returns GamepadJS instance
     */
    constructor(gamepadInfo) {
        super();
        if (GamepadJS.instance) {
            return GamepadJS.instance;
        }
        GamepadJS.instance = this;
        this.#gamepadInfo = gamepadInfo;

        //https://twitter.com/Tojiro/status/807758580791197696
        //console.log(navigator.getVRDisplays() );
        window.addEventListener('gamepadconnected', this.#onGamepadConnected);
        window.addEventListener('gamepaddisconnected', this.#onGamepadDisconnected);
    }

    #onGamepadConnected = e => {
        const { gamepad } = e;
        const { index, id } = gamepad;

        if (this.#debug) {
            console.log(`%cGamepadJS.CONNECTED`, 'font-weight: bold; color: #ccc');
            console.table({
                index, id, mapping: gamepad.mapping
            })
        }

        const control = this.#controls[`control${index}`] = new Control(gamepad, index)//{ index, buttons: {} };

        this.#mapping = xboxMapping;
        if (this.#gamepadInfo) {
            this.#mapping = this.#gamepadInfo[gamepad.id]?.mapping;
        }

        console.log(gamepad.mapping);

        for (let buttonName in this.#mapping.buttons) {
            control.addButton(buttonName, this.#mapping.buttons[buttonName]);
        }
        for (let buttonName in this.#mapping.axes) {
            control.addButton(buttonName, this.#mapping.axes[buttonName]);
        }

        this.dispatchEvent(new CustomEvent(GamepadJS.CONNECTED, { detail: control }));
    }

    #onGamepadDisconnected = e => {
        if (this.#debug) {
            const { gamepad } = e;
            const { index, id } = gamepad;
            console.log(`%cGamepadJS.DISCONNECTED`, 'font-weight: bold; color: #ccc');
            console.table({
                index, id, mapping: gamepad.mapping
            })
        }

        this.#controls[`control${e.gamepad.index}`] = null;
        this.dispatchEvent(new Event(GamepadJS.DISCONNECTED));
    }

    onConnected(f) {
        this.addEventListener(GamepadJS.CONNECTED, f);
    }

    onDisconnected(f) {
        this.addEventListener(GamepadJS.DISCONNECTED, f);
    }

    #getGamepads() {
        return navigator.getGamepads();
    }

    #isObject = v => typeof v === 'object' && v !== null;

    // #distance = (x, y) => Math.sqrt(x * x + y * y);

    /**
     * To be called in the `requestAnimationFrame`
     * @param {(gamepads: Object.<string, Control>)} f callback
     */
    update = f => {
        const gamepads = this.#getGamepads();
        for (let key in this.#controls) {
            const control = this.#controls[key];
            const gamepad = gamepads[control?.index];
            const mapping = this.#mapping;

            if (!mapping || !gamepad) {
                continue;
            }

            if (!control.hasVibrationActuator) {
                control.gamepad = gamepad;
            }

            control.pose = gamepad.pose;

            for (let buttonName in mapping.buttons) {
                const button = control.buttons[buttonName];
                const gamepadButton = gamepad.buttons[button.index];
                button.debug = this.#debug;
                console.log(gamepadButton.value);

                button.setProperties(gamepadButton)
                button.dispatchEventIfPushed();
            }

            for (let buttonName in mapping.axes) {
                const mappingButton = mapping.axes[buttonName];
                const isObject = this.#isObject(mappingButton);

                const button = control.buttons[buttonName];
                button.debug = this.#debug;

                if (isObject) {
                    button.setProperties({ x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y] })
                } else {
                    button.value = gamepad.axes[mappingButton]
                }
                button.dispatchEventIfPushed();
            }
        }

        f(this.#controls);
    }

    /** Enable to see info about the device in the console.
     * @param {boolean} v
     */
    set debug(v) {
        this.#debug = v;
    }
}
