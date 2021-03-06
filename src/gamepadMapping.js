/*
    Each mapping has a set of buttons and some have or not axes,
    inside there's a key that you will use to retrieve the event
    and the mapped value that corresponds to that key.

    The axes are compound, but you can copy the same axis for others.

*/

    var rightMapping = {
        buttons:{
            RJB: 0,
            INDEX: 1,
            HAND: 2,
            A: 3,
            B: 4,
            MENU: 5,
        },
        axes: {
          LJX: {x: 0, y: 1},
          RJX: {x: 2, y: 3}
        }

    };

    var leftMapping = {
        buttons:{
            LJB: 0,
            INDEX: 1,
            HAND: 2,
            X: 3,
            Y: 4,
            MENU: 5,
        },
        axes: {
          LJX: {x: 0, y: 1},
          RJX: {x: 2, y: 3}
        }

    };

    var xboxMapping = {
        buttons:{
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
        axes:{
            LJX: {x: 0, y: 1},
            RJX: {x: 2, y: 3}
        }
    };

    var remoteMapping = {
        buttons:{
            SELECT: 0,
            BACK: 1,

            UP: 2,
            DOWN: 3,
            LEFT: 4,
            RIGHT: 5,

        }
    };

    /*

        The key(s) in gamepadInfo is a string to select the gamepad based on the
        string used as gamepad.id

        The XBOX controller has this id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'
        but I retrieve it using only a key part of that string, which is 'xbox'.
        Same goes for the other controllers: 'right', 'left' and 'remote'

    */

    var gamepadInfo = {
        xbox:{
            mapping: xboxMapping
        },
        right:{
            mapping: rightMapping
        },
        left:{
            mapping: leftMapping
        },
        remote:{
            mapping: remoteMapping
        }
    };
