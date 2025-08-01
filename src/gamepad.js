/**
 * @author Sebastián Sanabria Díaz
 * This module contains {@link GamepadJS}, {@link Control} and {@link Button} which are the
 * three main classes of this library.
 *
 * Gamepad controls loosely based on this MDN link:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://developers.google.com/web/fundamentals/vr/adding-input-to-a-webvr-scene/
 *
 * Haptics:
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 * @module
 */

import { defaultMapping0, defaultMapping1 } from './gamepadMapping.js';

/**
 * Two times PI.
 * https://en.wikipedia.org/wiki/Tau
 * For better circle calculations.
 */
export const TAU = Math.PI * 2;

/**
 * Button
 * Umbrella term and class for a Gamepad API button and axis.
 * If a button or an axis is pressed it will be represented as a Button.
 * A button is part of a {@link Control}.
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
    #x = 0;
    #y = 0;

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

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
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

    /**
     * Normalized amount of angle.
     * .5 is 50% of the angle.
     */
    get proportion() {
        return this.#proportion;
    }

    get touched() {
        return this.#touched;
    }

    get value() {
        return this.#value
    }

    /**
     * only used for Firefox fix
     */
    set value(v) {
        this.#lastValue = this.#value;
        this.#value = v;
        this.#touched = -.9 < v;
        // to solve a bug if the value starts in zero (Firefox)
        if (this.#lastValue === this.#value && this.#value === 0) {
            this.#touched = false;
        }
        if (this.#touched) {
            this.#value = (this.#value + 1) * .5;
        } else {
            this.#value = 0; // restore to 0 or it becomes negative on Firefox
        }
        this.#dispatchEventIfPushed();
    }

    /**
     * To copy properties from the Gamepad API button
     * @param {Object} v
     */
    setProperties({ pressed, touched, value, x, y }) {
        this.pressed = pressed
        this.#touched = touched
        this.#x = x;
        this.#y = y;
        this.#value = value;
        if (x && y) {
            this.#distance = Math.sqrt(x * x + y * y);
            this.#angle = Math.atan2(-y, x);
            this.#proportion = this.#angle / TAU;
            if (this.#angle < 0) this.#angle += TAU;

            this.#touched = (Math.abs(x) > .1) || (Math.abs(y) > .1);
        }
        this.#dispatchEventIfPushed();
    }

    #dispatchEventIfPushed() {
        if (this.#touched && !this.#pushed) {
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
        if (!this.#touched && !this.#released) {
            this.dispatchEvent(new Event(Button.RELEASED));
            this.#pushed = false;
            this.#released = true;
        }
    }

    /**
     * Syntactic sugar for
     * `addEventListener(Button.PUSHED, f)`
     * @param {(event: Event) => void} f callback
     */
    onPushed(f) {
        this.addEventListener(Button.PUSHED, f);
    }

    /**
     * Syntactic sugar for
     * `addEventListener(Button.RELEASED, f)`
     * @param {(event: Event) => void} f callback
     */
    onReleased(f) {
        this.addEventListener(Button.RELEASED, f);
    }
}

/**
 * Control
 * Represents a single Gamepad.
 * It contains a reference to all the {@link Button}s associated with it.
 */
export class Control extends EventTarget {
    #gamepad = null;
    #index = null;
    #pose = null;
    #id = null;
    /** @type {Object.<string, Button>} */
    #buttons = {}
    constructor(gamepad) {
        super()
        this.#gamepad = gamepad;
        this.#index = gamepad.index;
        this.#id = gamepad.id;
    }

    /**
     * @param {Gamepad} v
     */
    set gamepad(v) {
        this.#gamepad = v;
    }

    get index() {
        return this.#index
    }

    get id() {
        return this.#id
    }

    get buttons() {
        return this.#buttons;
    }

    get pose() {
        return this.#pose
    }

    /**
     * @param {Object} v
     */
    set pose(v) {
        this.#pose = v;
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

    /**
     * Checks if one of the buttons in this control has been touched.
     * This to differentiate it from other controls events.
     */
    get touched() {
        for (let key in this.#buttons) {
            const button = this.#buttons[key];
            if (button.touched) {
                return true;
            }
        }
        return false;
    }
}

/**
 * GamepadJS
 * Main class to detect and use {@link Control}s.
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
    #logKeys = false;
    #tempAxesValues = null;

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

    /**
     *
     * @param {GamepadEvent} e
     */
    #onGamepadConnected = e => {
        const { gamepad } = e;
        const { index, id } = gamepad;

        if (this.#debug) {
            console.log(`%cGamepadJS.CONNECTED`, 'font-weight: bold; color: #ccc');
            console.table({
                index, id, mapping: gamepad.mapping
            })
        }

        const control = this.#controls[`control${index}`] = new Control(gamepad);

        this.#mapping = this.#getDefaultMapping(gamepad);
        if (this.#gamepadInfo) {
            this.#mapping ||= this.#gamepadInfo[gamepad.id]?.mapping;
        }

        for (let buttonName in this.#mapping.buttons) {
            control.addButton(buttonName, this.#mapping.buttons[buttonName]);
        }
        for (let buttonName in this.#mapping.axes) {
            control.addButton(buttonName, this.#mapping.axes[buttonName]);
        }

        this.dispatchEvent(new CustomEvent(GamepadJS.CONNECTED, { detail: control }));
    }

    /**
     *
     * @param {GamepadEvent} e
     */
    #onGamepadDisconnected = e => {
        const { gamepad } = e;
        const { index, id } = gamepad;
        if (this.#debug) {
            console.log(`%cGamepadJS.DISCONNECTED`, 'font-weight: bold; color: #ccc');
            console.table({
                index, id, mapping: gamepad.mapping
            })
        }

        const control = this.#controls[`control${index}`];
        this.dispatchEvent(new CustomEvent(GamepadJS.DISCONNECTED, { detail: control }));
        this.#controls[`control${index}`] = null;
    }

    /**
     *
     * @param {(event: Event) => void} f
     */
    onConnected(f) {
        this.addEventListener(GamepadJS.CONNECTED, f);
    }

    /**
     *
     * @param {(event: Event) => void} f
     */
    onDisconnected(f) {
        this.addEventListener(GamepadJS.DISCONNECTED, f);
    }

    #getGamepads() {
        return navigator.getGamepads();
    }

    #isObject = v => typeof v === 'object' && v !== null;

    /**
     * To be called in the `requestAnimationFrame`
     * @param {(gamepads: Object.<string, Control>) => void} f callback
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

            if (this.#logKeys) {
                for (let k in gamepad.buttons) {
                    const b = gamepad.buttons[k]
                    if (b.touched || b.pressed) {
                        console.log(`button: ${k}`);
                    }
                }
                for (let k in gamepad.axes) {
                    const b = gamepad.axes[k];

                    this.#tempAxesValues ||= new Map();
                    this.#tempAxesValues.set(gamepad, new Map())
                    const t = this.#tempAxesValues.get(gamepad).set(k);

                    t.set('lastValue', t.get('value') ?? 0);
                    t.set('value', b);

                    t.set('touched', Math.abs(t.get('lastValue') - t.get('value')) > .1);
                    if (t.get('touched')) {
                        console.log(`axis: ${k}`);
                    }
                }
            }

            for (let buttonName in mapping.buttons) {
                const button = control.buttons[buttonName];
                const gamepadButton = gamepad.buttons[button.index];
                button.debug = this.#debug;
                button.setProperties(gamepadButton);
            }

            for (let buttonName in mapping.axes) {
                const mappingButton = mapping.axes[buttonName];
                const isObject = this.#isObject(mappingButton);

                const button = control.buttons[buttonName];
                button.debug = this.#debug;

                if (isObject) {
                    button.setProperties({ x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y] })
                } else {
                    // Firefox fix
                    button.value = gamepad.axes[mappingButton];
                }
            }
        }

        f(this.#controls);
    }

    #getDefaultMapping(gamepad) {
        if (6 === gamepad.axes.length) {
            return defaultMapping1;
        }
        return defaultMapping0;
    }

    /** Enable to see info about the device in the console.
     * @param {boolean} v
     */
    set debug(v) {
        this.#debug = v;
    }

    /**
     * Enable to log the number of a key if it's not mapped
     * @param {boolean} v
     */
    set logKeys(v) {
        this.#logKeys = v;
    }
}
