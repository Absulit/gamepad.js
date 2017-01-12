# gamepad.js
Custom implementation of the Gamepad API for VR and gamepads.

Under development and subject to change in the future, so I can't garantee that it will work with your app in a new version.

Code is messy but works.

Further information on the gamepad API you can contact @Tojiro

This works with Oculus Rifth XBOX controller and the Touch Controllers.

Example:

```javascript

    /*
        Each controller has an String ID, use a key of the string to be found.
        In this example the left and right Touch Controllers, and the XBOX controllers.
    */
    var gamepadIdList = ['left', 'right', 'xbox'];

    /*
        Fired every time a button is pressed, no matter which

    */
    var onGamepadPressed = function(gamepads){
        var left = gamepads.left;
        var right = gamepads.right;
        var xbox = gamepads.xbox;

        var buttons = xbox.buttons;
        if(buttons.A.pressed){
            // TODO custom code
        }

        if(buttons.Y.pressed){
            // TODO custom code
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



    ABSULIT.gamepad.init(gamepadIdList, onGamepadPressed, onUpdate);

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


```javascript
