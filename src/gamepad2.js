export class Gamepad extends EventTarget {
    static instance;
    static PRESSED = 'PRESSED';
    #gamepads = null;
    #connected = false;
    #gamepadInfo = null;
    #formattedGamepads = {}; // TODO use Map
    #buttons = {};
    constructor(gamepadInfo) {
        super();
        if (Gamepad.instance) {
            return Gamepad.instance;
        }
        Gamepad.instance = this;
        this.#gamepadInfo = gamepadInfo;

        window.addEventListener('gamepadconnected', this.#onGamepadConnected);
        window.addEventListener("gamepaddisconnected", this.#onGamepadDisconnected);
    }

    #init(){
        for (let gamepadId in this.#gamepadInfo) {
            const gamepad = this.#getController(gamepadId)

            if (!gamepad) {
                continue;
            }

            this.#formattedGamepads[gamepadId] = {}
            this.#formattedGamepads[gamepadId].haptics = gamepad.hapticActuators;
            this.#formattedGamepads[gamepadId].vibrationActuator = gamepad.vibrationActuator;
            this.#formattedGamepads[gamepadId].vibrate = (d, v) => this.#vibrate(d, v, gamepad);
        }
    }

    #getGamepads() {
        return navigator.getGamepads();
    }

    #onGamepadConnected = e => {
        console.log('---- #onGamepadConnected', e.gamepad.index, e.gamepad.id);
        this.#connected = true;
        this.#init();
    }

    #onGamepadDisconnected = e => {
        console.log('---- #onGamepadDisconnected', e.gamepad.index, e.gamepad.id);
        this.#connected = false;
    }

    #getController(id) {
        const gamepads = this.#getGamepads();
        return gamepads.find(gp => gp?.id.toLowerCase().indexOf(id) !== -1)
    }

    update = f => {
        if (!this.#connected) {
            return;
        }

        for (let gamepadId in this.#gamepadInfo) {
            const gamepad = this.#getController(gamepadId)

            if (!gamepad) {
                continue;
            }
            const {mapping} = this.#gamepadInfo[gamepadId];

            const formattedGamepad = this.#formattedGamepads[gamepadId]
            formattedGamepad.pose = gamepad.pose;


            for (let buttonName in mapping.buttons) {
                this.#buttons[buttonName] = gamepad.buttons[mapping.buttons[buttonName]];
            }

            for (let buttonName in mapping.axes) {
                const mappingButton = mapping.axes[buttonName];
                const button = this.#buttons[buttonName] = { x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y] };

                button.pressed = (Math.abs(button.x) > .1) || (Math.abs(button.y) > .1);
                button.angle = Math.atan2(button.y, button.x);
            }

            formattedGamepad.buttons = this.#buttons;

            f(this.#formattedGamepads)
        }
    }

    #vibrate(duration, intensity, gamepad) {
        if (gamepad.vibrates) {
            return
        }
        intensity ||= 1;
        gamepad.vibrates = true
        gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: .1,
            strongMagnitude: intensity,
        }).then(() => {
            gamepad.vibrates = false
        });
    }
}


