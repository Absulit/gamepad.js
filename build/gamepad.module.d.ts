/**
 * Button
 * Umbrella term and class for a Gamepad API button and axis.
 * If a button or an axis is pressed it will be represented as a Button.
 * A button is part of a {@link Control}.
 */
export class Button extends EventTarget {
    static PUSHED: string;
    static RELEASED: string;
    /**
     *
     * @param {string} name
     * @param {Number} index
     */
    constructor(name: string, index: number);
    get name(): any;
    get index(): any;
    get x(): number;
    get y(): number;
    /**
     * @param {boolean} v
     */
    set debug(v: boolean);
    /**
     * angle in radians
     * This is done by GamepadJS, you don't have to set it.
     */
    get angle(): number;
    /**
     * distance from the center of the joystick
     */
    get distance(): number;
    /**
     * Normalized amount of angle.
     * .5 is 50% of the angle.
     */
    get proportion(): number;
    get touched(): boolean;
    /**
     * only used for Firefox fix
     */
    set value(v: number);
    get value(): number;
    /**
     * To copy properties from the Gamepad API button
     * @param {Object} v
     */
    setProperties({ pressed, touched, value, x, y }: any): void;
    pressed: any;
    /**
     * Syntactic sugar for
     * `addEventListener(Button.PUSHED, f)`
     * @param {(event: Event) => void} f callback
     */
    onPushed(f: (event: Event) => void): void;
    /**
     * Syntactic sugar for
     * `addEventListener(Button.RELEASED, f)`
     * @param {(event: Event) => void} f callback
     */
    onReleased(f: (event: Event) => void): void;
    #private;
}
/**
 * Control
 * Represents a single Gamepad.
 * It contains a reference to all the {@link Button}s associated with it.
 */
export class Control extends EventTarget {
    constructor(gamepad: any);
    /**
     * @param {Gamepad} v
     */
    set gamepad(v: Gamepad);
    get index(): any;
    get id(): any;
    get buttons(): {
        [x: string]: Button;
    };
    /**
     * @param {Object} v
     */
    set pose(v: any);
    get pose(): any;
    /**
     * Vibrates the controller
     * @param {Number} duration
     * @param {Number} intensity
     */
    vibrate(duration: number, intensity: number): void;
    /**
     * Add an button with alias `name`
     * @param {string} name Name the button will be called on later
     * @param {Number} index button index from the Gamepad API
     */
    addButton(name: string, index: number): void;
    get hasVibrationActuator(): boolean;
    /**
     * Checks if one of the buttons in this control has been touched.
     * This to differentiate it from other controls events.
     */
    get touched(): boolean;
    #private;
}
/**
 * GamepadJS
 * Main class to detect and use {@link Control}s.
 */
export class GamepadJS extends EventTarget {
    static instance: any;
    static CONNECTED: string;
    static DISCONNECTED: string;
    /**
     *
     * @param {Object.<string, Object>|null} gamepadInfo
     * @returns GamepadJS instance
     */
    constructor(gamepadInfo: {
        [x: string]: any;
    } | null);
    /**
     *
     * @param {(event: Event) => void} f
     */
    onConnected(f: (event: Event) => void): void;
    /**
     *
     * @param {(event: Event) => void} f
     */
    onDisconnected(f: (event: Event) => void): void;
    /**
     * To be called in the `requestAnimationFrame`
     * @param {(gamepads: Object.<string, Control>) => void} f callback
     */
    update: (f: (gamepads: {
        [x: string]: Control;
    }) => void) => void;
    /** Enable to see info about the device in the console.
     * @param {boolean} v
     */
    set debug(v: boolean);
    /**
     * Enable to log the number of a key if it's not mapped
     * @param {boolean} v
     */
    set logKeys(v: boolean);
    #private;
}
/**
 *  The key(s) in gamepadInfo is a string to select the gamepad based on the
 *  string used as gamepad.id
 *
 *  The XBOX controller has this id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'
 *  but I retrieve it using only a key part of that string, which is 'xbox'.
 *  Same goes for the other controllers: 'right', 'left' and 'remote'
 */
export const gamepadInfo: {
    'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 02dd)': {
        mapping: {
            buttons: {
                A: number;
                B: number;
                X: number;
                Y: number;
                LB: number;
                RB: number;
                LT: number;
                RT: number;
                VIEW: number;
                MENU: number;
                LJB: number;
                RJB: number;
                UP: number;
                DOWN: number;
                LEFT: number;
                RIGHT: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
            };
        };
    };
    '045e-02dd-Microsoft X-Box One pad (Firmware 2015)': {
        mapping: {
            buttons: {
                A: number;
                B: number;
                X: number;
                Y: number;
                LB: number;
                RB: number;
                VIEW: number;
                MENU: number;
                LJB: number;
                RJB: number;
                UP: number;
                DOWN: number;
                LEFT: number;
                RIGHT: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
                LT: number;
                RT: number;
            };
        };
    };
    'Xbox 360 Controller (XInput STANDARD GAMEPAD)': {
        mapping: {
            buttons: {
                A: number;
                B: number;
                X: number;
                Y: number;
                LB: number;
                RB: number;
                LT: number;
                RT: number;
                VIEW: number;
                MENU: number;
                LJB: number;
                RJB: number;
                UP: number;
                DOWN: number;
                LEFT: number;
                RIGHT: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
            };
        };
    };
    xinput: {
        mapping: {
            buttons: {
                A: number;
                B: number;
                X: number;
                Y: number;
                LB: number;
                RB: number;
                VIEW: number;
                MENU: number;
                LJB: number;
                RJB: number;
                UP: number;
                DOWN: number;
                LEFT: number;
                RIGHT: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
                LT: number;
                RT: number;
            };
        };
    };
    right: {
        mapping: {
            buttons: {
                RJB: number;
                INDEX: number;
                HAND: number;
                A: number;
                B: number;
                MENU: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
            };
        };
    };
    left: {
        mapping: {
            buttons: {
                LJB: number;
                INDEX: number;
                HAND: number;
                X: number;
                Y: number;
                MENU: number;
            };
            axes: {
                LJX: {
                    x: number;
                    y: number;
                };
                RJX: {
                    x: number;
                    y: number;
                };
            };
        };
    };
    remote: {
        mapping: {
            buttons: {
                SELECT: number;
                BACK: number;
                UP: number;
                DOWN: number;
                LEFT: number;
                RIGHT: number;
            };
        };
    };
};
