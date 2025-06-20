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

    #getGamepads(){
        return navigator.getGamepads();
    }

    #onGamepadConnected = e => {
        console.log('---- #onGamepadConnected', e.gamepad.index, e.gamepad.id);
        this.#gamepads = this.#getGamepads();
        console.log(this.#gamepads);
        this.#connected = true;
    }

    #onGamepadDisconnected = e => {
        console.log('---- #onGamepadDisconnected', e.gamepad.index, e.gamepad.id);
        this.#connected = false;
    }

    test() {
        this.dispatchEvent(new Event(Gamepad.PRESSED))

    }

    #getController(id){
        // console.log(gamepads, id);
        var gp, gpindex;
        this.#gamepads = this.#getGamepads();
        for(gpindex in this.#gamepads){
            gp = this.#gamepads[gpindex];
            //console.log(gp);
            // console.log('---- gp.id',gp?.id, gp?.id.toLowerCase().indexOf(id));
            if(gp !== null && (typeof gp == "object") && (gp.id.toLowerCase().indexOf(id) !== -1)){
                break;
            }
        }
        return gp;
    }

    update = f => {
        if(!this.#connected){
            return;
        }

        for(let gamepadId in this.#gamepadInfo){
            // console.log(gamepadId);
            const mapping = this.#gamepadInfo[gamepadId].mapping;
            const gamepad = this.#getController(gamepadId)
            if(!gamepad){
                continue;
            }
            this.#buttons = {}
            // console.log(gamepad);

            this.#formattedGamepads = {};
            this.#formattedGamepads[gamepadId] = {};
            this.#formattedGamepads[gamepadId].pose = gamepad.pose;


            for (let buttonName in mapping.buttons){
                this.#buttons[buttonName] = gamepad.buttons[mapping.buttons[buttonName]];
            }

            // console.log(gamepad.axes);

            for(let buttonName in mapping.axes){
                const mappingButton = mapping.axes[buttonName];

                const button = this.#buttons[buttonName] = {x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y]};

                this.#buttons[buttonName].pressed = (Math.abs(button.x) > .1) || (Math.abs(button.y) > .1);
                this.#buttons[buttonName].angle = Math.atan2(button.y, button.x);
            }

            this.#formattedGamepads[gamepadId].buttons = this.#buttons;
            this.#formattedGamepads[gamepadId].haptics = gamepad.hapticActuators;
            this.#formattedGamepads[gamepadId].vibrationActuator = gamepad.vibrationActuator;




            f(this.#formattedGamepads)
        }
    }
}


