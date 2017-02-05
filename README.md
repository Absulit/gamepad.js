# gamepad.js
Custom implementation (wrapper) of the Gamepad API for VR and gamepads.

Under development and subject to change in the future, so I can't garantee that it will work with your app in a new version.

This works with Oculus Rifth XBOX controller, the Oculus Remote Controller and the Oculus Touch Controllers. For it to work with HTC Vive you will need to create a mapping object similar to the ones in gamepadMapping.js but I'll add it later.

I've created a set of mappings in gamepadMapping.js, they are meant to be used with the control you require to detect and as examples for new types of gamepads..


Further information on the gamepad API you can contact @Tojiro (twitter.com/tojiro)

# Example:

```javascript

    /*
        Each controller has an String ID, use a key of the string to find the controller.
        In this example the left and right Touch Controllers, the remote and the XBOX controllers.

        Note: the mapping variables are in src/gamepadMapping.js
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

    /*
        Fired every time a button is pressed, no matter which

    */
    var onGamepadPressed = function(gamepads){
        // The same keys used in gamepadInfo are used to retrieve the gamepad
        var left = gamepads.left;
        var right = gamepads.right;
        var xbox = gamepads.xbox;
        var remote = gamepads.remote;


        if(xbox){
            var buttons = xbox.buttons;
            if(buttons.A.pressed){
                // Fire the XBOX haptic vibration
                xbox.haptics[1].pulse(1, 100);
            }

            if(buttons.Y.pressed){
                // TODO custom code
            }
        }


        if(remote){
            var buttons = remote.buttons;

            if(buttons.SELECT.pressed){
                // Fire the XBOX haptic from the remote controller
                xbox.haptics[0].pulse(1, 100);
            }
        }




        // Threejs Mesh called handLeft and handRight for the Touch Controllers hands
        handLeft.position.fromArray(left.pose.position);
        handLeft.quaternion.fromArray( left.pose.orientation );


        handRight.position.fromArray(right.pose.position);
        handRight.quaternion.fromArray( right.pose.orientation );
    };

    /*
        If the Pressed is not enough, you can call the values on an Update
    */

    var onUpdate = function(gamepads){

    };



    ABSULIT.gamepad.init(gamepadInfo, onGamepadPressed, onUpdate);

    /**********************/

    /*
        The update function is the animate() in Threejs.
        It is called via requestAnimationFrame(), so it is called as many times as the
        available hardware/display in Hertz
    */

    function update() {
        requestAnimationFrame(update);
        ABSULIT.gamepad.update();
    }


```
