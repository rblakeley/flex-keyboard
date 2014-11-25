var keyboard;

$(document).ready(function () {
    keyboard = new Keyboard({
        inputContainer: $('#input_container'),
        boardContainer: $('#keyboard_container')
    });
    
    keyboard.init();
});