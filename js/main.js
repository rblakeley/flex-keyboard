var keyboard;

$(document).ready(function () {
    keyboard = new Keyboard({
        boardContainer: $('#keyboard_container'),
        initInput: $('input').first(),
        // layout: {
        //     lowercase: {
        //         row1: [{ value: 'q' },{ value: 'w' },{ value: 'e' },{ value: 'r' },{ value: 't' },{ value: 'y' },{ value: 'u' },{ value: 'i' },{ value: 'o' },{ value: 'p' }],
        //         row2: [{ value: 'a' },{ value: 's' },{ value: 'd' },{ value: 'f' },{ value: 'g' },{ value: 'h' },{ value: 'j' },{ value: 'k' },{ value: 'l' }],
        //         row3: [{ value: 'z' },{ value: 'x' },{ value: 'c' },{ value: 'v' },{ value: 'b' },{ value: 'n' },{ value: 'm' }]
        //     },
        //     numeric: {
        //         row1: [{ value: '1' },{ value: '2' },{ value: '3' }],
        //         row2: [{ value: '4' },{ value: '5' },{ value: '6' }],
        //         row3: [{ value: '7' },{ value: '8' },{ value: '9' }],
        //         row4: [{ value: '0' }]
        //     }
        // }
    });
    
    keyboard.init();
});