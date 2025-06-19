export class Gamepad extends EventTarget {
    static instance;
    static PRESSED = 'PRESSED';
    #gamepads = null;
    #connected = false;
    #gamepadInfo = null;
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

    update = _ => {
        if(!this.#connected){
            return;
        }

        for(let gamepadId in this.#gamepadInfo){
            // console.log(gamepadId);
            const mapping = this.#gamepadInfo[gamepadId].mapping;
            const gamepad = this.#getController(gamepadId)
            // console.log(gamepad);

        }
    }
}


