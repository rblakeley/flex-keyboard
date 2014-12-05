var keyboard,
    $hint;

$(document).ready(function () {
    keyboard = new Keyboard({
        inputContainer: $('#input_container'),
        boardContainer: $('#keyboard_container')
    });
    keyboard.init();

    $hint = $('<h4>', {
        class: 'hint',
        html: "Click the input above to show keyboard."
    });
    $('#input_container input').on('click', function () {
        $hint.hide();
    });
    $('#input_container button.cancel').on('click', function (e) {
        setTimeout(function () {
            $hint.fadeIn()
        }, 200);
        e.stopPropagation();
    });
    $('#main').append($hint);
});