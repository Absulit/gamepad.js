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

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.gamepad = ABSULIT.gamepad || (function () {
    'use strict';
    var object = {},
        gamepad = null,
        gamepads = {},
        gamepadConnected = false;

    var onGamepadPressedLocal,
        onUpdateLocal,
        gamepadInfoLocal,
        buttons = {},
        formattedGamepads = {};


    object.init = function (gamepadInfo /*gamepadIdList*/, onGamepadPressed, onUpdate) {
        onGamepadPressedLocal = onGamepadPressed;
        onUpdateLocal = onUpdate;
        gamepadInfoLocal = gamepadInfo;

        //https://twitter.com/Tojiro/status/807758580791197696
        //console.log(navigator.getVRDisplays() );

        window.addEventListener("gamepadconnected", function(e) {

            gamepads = getGamepads();
            console.log(gamepads);
            gamepad = getController(gamepads, 'standard');
            console.log(gamepad);
            gamepadConnected = !!gamepad;
            console.log(e, gamepadConnected);
        });

        window.addEventListener("gamepaddisconnected", function(e) {
          console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);

            gamepadConnected = false;
        });

        gamepads = getGamepads();
        gamepad = getController(gamepads, 'xbox');
        gamepadConnected = !!gamepad;
        console.log("---- gamepadConnected: ", gamepadConnected);

        window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
        window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
    };

    /* -------------------- */

    function gamepadHandler(event, connecting) {
      var gamepad = event.gamepad;
      // Note:
      // gamepad === navigator.getGamepads()[gamepad.index]

      if (connecting) {
        gamepads[gamepad.index] = gamepad;
      } else {
        delete gamepads[gamepad.index];
      }
    }

    /* -------------------- */

    function getGamepads(){
        return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    }

    function getController(gamepads, id){
        // console.log(gamepads, id);
        var gp, gpindex;
        for(gpindex in gamepads){
            gp = gamepads[gpindex];
            //console.log(gp);
            // console.log('---- gp.id',gp?.id, gp?.id.toLowerCase().indexOf(id));
            if(gp !== null && (typeof gp == "object") && (gp.id.toLowerCase().indexOf(id) !== -1)){
                break;
            }
        }
        return gp;
    }


    var gamepadId,
        button;
    object.update = function () {
        //gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        gamepads = getGamepads();

        /* -------------------- */
        for(gamepadId in gamepadInfoLocal){
            buttons = {};
            //gamepadId = gamepadIdListLocal[gamepadIdListIndex].gamepadId;
            var mapping = gamepadInfoLocal[gamepadId].mapping;
            gamepad = getController(gamepads, gamepadId);
            // console.log(gamepad);

            if(gamepadConnected && gamepad?.buttons){

                formattedGamepads[gamepadId] = {};
                formattedGamepads[gamepadId].pose = gamepad.pose;


                for (var buttonName in mapping.buttons){
                    buttons[buttonName] = gamepad.buttons[mapping.buttons[buttonName]];
                }
                for(var buttonName in mapping.axes){
                    var mappingButton = mapping.axes[buttonName];

                    button = buttons[buttonName] = {x: gamepad.axes[mappingButton.x], y: gamepad.axes[mappingButton.y]};
                    buttons[buttonName].pressed = (Math.abs(button.x) > .1) || (Math.abs(button.y) > .1);
                    buttons[buttonName].angle = Math.atan2(button.y, button.x);
                }

                formattedGamepads[gamepadId].buttons = buttons;
                formattedGamepads[gamepadId].haptics = gamepad.hapticActuators;

            }

        }
        onGamepadPressedLocal(formattedGamepads);

        /* -------------------- */
        onUpdateLocal(formattedGamepads);
    };

    return object;

})();
