/*
    Each mapping has a set of buttons and some have or not axes,
    inside there's a key that you will use to retrieve the event
    and the mapped value that corresponds to that key.

    The axes are compound, but you can copy the same axis for others.

*/

/**
 * right hand mapping for vr devices
 */
export const rightMapping = {
    buttons: {
        RJB: 0,
        INDEX: 1,
        HAND: 2,
        A: 3,
        B: 4,
        MENU: 5,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 }
    }

};

/**
 * left hand mapping for vr devices
 */
export const leftMapping = {
    buttons: {
        LJB: 0,
        INDEX: 1,
        HAND: 2,
        X: 3,
        Y: 4,
        MENU: 5,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 }
    }

};

/**
 * XBOX controller mapping
 */
export const xboxMapping = {
    buttons: {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,

        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,

        VIEW: 8,
        MENU: 9,

        LJB: 10,
        RJB: 11,

        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 }
    }
};

/**
 * XBOX mapping adapted to Firefox
 */
export const xboxMappingFirefox = {
    buttons: {
        A: 0,
        B: 1,
        X: 3,
        Y: 2,

        LB: 4,
        RB: 5,
        // LT: 6,
        // RT: 7,

        VIEW: 8,
        MENU: 9,

        LJB: 10,
        RJB: 11,

        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 },
        LT: 4,
        RT: 5,
    }
};

/**
 * VR remote controller mapping
 */
export const remoteMapping = {
    buttons: {
        SELECT: 0,
        BACK: 1,

        UP: 2,
        DOWN: 3,
        LEFT: 4,
        RIGHT: 5,

    }
};

/**
 * Default mapping to load if no gamepadInfo is passed in the {@link GamepadJS} constructor.
 */
export const defaultMapping0 = {
    buttons: {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,

        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,

        VIEW: 8,
        MENU: 9,

        LJB: 10,
        RJB: 11,

        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 }
    }
};

/**
 * Default mapping to load if no gamepadInfo is passed in the {@link GamepadJS} constructor,
 * with the difference that this one is passed if the axes are different.
 */
export const defaultMapping1 = {
    buttons: {
        A: 0,
        B: 1,
        X: 3,
        Y: 2,

        LB: 4,
        RB: 5,
        // LT: 6,
        // RT: 7,

        VIEW: 8,
        MENU: 9,

        LJB: 10,
        RJB: 11,

        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
    },
    axes: {
        LJX: { x: 0, y: 1 },
        RJX: { x: 2, y: 3 },
        LT: 4,
        RT: 5,
    }
};

/**
 *  The key(s) in gamepadInfo is a string to select the gamepad based on the
 *  string used as gamepad.id
 *
 *  The XBOX controller has this id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'
 *  but I retrieve it using only a key part of that string, which is 'xbox'.
 *  Same goes for the other controllers: 'right', 'left' and 'remote'
 */
export const gamepadInfo = {
    'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 02dd)': {
        mapping: xboxMapping
    },
    '045e-02dd-Microsoft X-Box One pad (Firmware 2015)': {
        mapping: xboxMappingFirefox
    },
    'Xbox 360 Controller (XInput STANDARD GAMEPAD)': {
        mapping: xboxMapping
    },
    'xinput': {
        mapping: xboxMappingFirefox
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
