$(document).ready(function () {
    var $testInput = $('input').first().focus();

    Keyboard.init("keyboard_container");
    Keyboard.currentInput = $testInput;
    Keyboard.currentCursorPosition = 0;
});