// @refactor as constructor
var Keyboard = {
    layout: {},
    currentInput: null,
    init: function (id) {
        var that = this;
        
        this.id = id;
        this.layout['basic'] = this.basicLayout;

        this.generateBoard('basic');
        
        $(':input').not('[type="reset"], [type="submit"]')
            .on('focus, click', function (e) {
                var $input = that.currentInput = $(this);
            
                that.currentCursorPosition = $input.getCursorPosition();
                that.currentSelection = $input.getSelection();
                // @todo accomodate typing on physical keyboard
                // physical keyboard: write
                // Keyboard.currentInput[0].onkeypress = function (e) {
                //     e.preventDefault();
                //     var elem = $(".button[onclick='Keyboard.write(" + e.which + ");']");
                //     elem.click();
                // };
                // physical keyboard: delete
                // Keyboard.currentInput[0].onkeydown = function (e) {
                //     if (e.which === 8) {
                //         e.preventDefault();
                //         var elem = $(".button[onclick='Keyboard.del()']")[0];
                //         console.log(elem);
                //         elem.click();
                //     }
                // };
                console.log('keyboard is now focused on ' + that.currentInput.attr('name') 
                            + ' at pos(' + that.currentCursorPosition + ')');
            });
    },
    generateBoard: function (layoutName) {
        var layout = this.layout[layoutName];
        var that = this;
        var $board = $('<div>')
            // .attr('id', 'keyboard')
            .addClass('board-container');
// modifier contains a set of keys displayed together
        var modifier;
        for (modifier in layout) {
            var $modContainer = $('<div>');

            $modContainer.addClass(modifier);
// create keys in rows
            $.each(layout[modifier], function (rowName, keys) {
                var $row = $('<div>');
                var i = 0;

                $row.addClass('row board-container');
                
                for (i; i < keys.length; i += 1) {
                    var $button = that.generateButton(keys[i]);
                    $row.append($button);
                }

                $modContainer.append($row);
            });

            $board.append($modContainer);
        }

        $('#' + that.id).append($board);
    },
    generateButton: function (keyData) {
        var text = String.fromCharCode(keyData.value);
        var $key = $('<div>');
        var $button = $('<div>');

        $key.text(text).addClass('key');
        
        if (keyData.buttonClass) $button.addClass(keyData.buttonClass);
        $button.addClass('button')
            .on('click', this.write(keyData.value))
            .append($key);

        return $button;
    },
    changeToLowercase: function () {
        $('#keyboard').find('.uppercase, .numeric, .symbolic').css('display', 'none');
        $('#keyboard').find('.lowercase').css('display', 'block');
    },
    changeTouppercase: function () {
        $('#keyboard').find('.uppercase').css('display', 'block');
        $('#keyboard').find('.lowercase, .numeric, .symbolic').css('display', 'none');
    },
    changeToNumber: function () {
        $('#keyboard').find('.numeric').css('display', 'block');
        $('#keyboard').find('.symbolic, .uppercase, .lowercase').css('display', 'none');
    },
    changeToSymbols: function () {
        $('#keyboard').find('.uppercase, .numeric, .lowercase').css('display', 'none');
        $('#keyboard').find('.symbolic').css('display', 'block');
    },
    write: function (charCode) {
        var that = this;
        var character = String.fromCharCode(charCode);

        return function () {
            var text = that.currentInput.val();
            var position = that.currentCursorPosition;
            var selection = that.currentSelection;
            var output = (function () {
                if (selection) {
                    var tail = text.slice(text.indexOf(selection) + selection.length);
                    return [text.slice(0, text.indexOf(selection)), character, tail].join('');
                } else {
                    return [text.slice(0, position), character, text.slice(position)].join('');
                }
            }());

            that.currentInput.val(output);
            that.currentCursorPosition += 1;
            that.currentSelection = null;
        };
    },
    del: function () {
        var text = this.currentInput.val();
        var position = this.currentCursorPosition;
        var selection = this.currentSelection;
        var output = (function () {
            if (selection) {
                var tail = text.slice(text.indexOf(selection) + selection.length);
                return [text.slice(0, text.indexOf(selection)), tail].join('')
            } else {
                return [text.slice(0, position - 1), text.slice(position)].join('');
            }
        }());

        this.currentInput.val(output);
        if (!selection) 
            this.currentCursorPosition -= 1;
        if (this.currentCursorPosition < 0)
            this.currentCursorPosition = 0;
        this.currentSelection = null;
    },
/**
 * @refactor 
 * add modifier keys
 * add special characters
 */
    basicLayout: {
        // uppercase: [
        //     // Q, W, E, R, T, Y, U, I, O, P,
        //     { value: 81, buttonClass: 'row-start' },{ value: 87 },{ value: 69 },{ value: 82 },{ value: 84 },{ value: 89 },{ value: 85 },{ value: 73 },{ value: 79 },{ value: 80 },
        //     // A, S, D, F, G, H, J, K, L,
        //     { value: 65, buttonClass: 'row-start' },{ value: 83 },{ value: 68 },{ value: 70 },{ value: 71 },{ value: 72 },{ value: 74 },{ value: 75 },{ value: 76 },
        //     // Z, X, C, V, B, N, M
        //     { value: 90, buttonClass: 'row-start' },{ value: 88 },{ value: 67 },{ value: 86 },{ value: 66 },{ value: 78 },{ value: 77 }
        // ],
        lowercase: {
             // q, w, e, r, t, y, u, i, o, p,
            row1: [{ value: 113 },{ value: 119 },{ value: 101 },{ value: 114 },{ value: 116 },{ value: 121 },{ value: 117 },{ value: 105 },{ value: 111 },{ value: 112 }],
            // a, s, d, f, g, h, j, k, l,
            row2: [{ value: 97 },{ value: 115 },{ value: 100 },{ value: 102 },{ value: 103 },{ value: 104 },{ value: 106 },{ value: 107 },{ value: 108 }],
            // z, x, c, v, b, n, m
            row3: [{ value: 122 },{ value: 120 },{ value: 99 },{ value: 118 },{ value: 98 },{ value: 110 },{ value: 109 }]
        },
        numeric: {
            // 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
            row1: [{ value: 49, buttonClass: 'row-start'},{ value: 50 },{ value: 51 },{ value: 52 },{ value: 53 },{ value: 54 },{ value: 55 },{ value: 56 },{ value: 57 },{ value: 48 }]
        },
        // symbolic: [
        //     { value: 32 },{ value: 33 },{ value: 34 },{ value: 35 },{ value: 36 },{ value: 37 },{ value: 38 },{ value: 39 },
        //     { value: 40 },{ value: 41 },{ value: 42 },{ value: 43 },{ value: 44 },{ value: 45 },{ value: 46 },{ value: 47 },
        //     { value: 58 },{ value: 59 },
        //     { value: 60 },{ value: 61 },{ value: 62 },{ value: 63 },{ value: 64 },
        //     { value: 91 },{ value: 92 },{ value: 93 },{ value: 94 },{ value: 95 },
        //     { value: 123 },{ value: 124 },{ value: 125 },{ value: 126 },
        //     { value: 163 },{ value: 165 },

        //     { value: "Delete", isChar: false, buttonClass: 'del', onclick: 'Keyboard.del()' },
        //     { value: "abc", isChar: false, buttonClass: 'lowercase', onclick: 'Keyboard.changeToLowercase();' },
        //     { value: "ABC", isChar: false, buttonClass: 'symbolsright', onclick: 'Keyboard.changeTouppercase();' },
        //     { value: "123", isChar: false, buttonClass: 'numberleft', onclick: 'Keyboard.changeToNumber();' },
        //     { value: "#$+", isChar: false, buttonClass: 'symbolsright', onclick: 'Keyboard.changeToSymbols();' }
        // ]
    }
}

jQuery.fn.getCursorPosition = function () {
    var input = this[0];
    var position;

    if (typeof input.selectionStart === 'number') {
        position = input.selectionStart;
    }
    // @todo support <IE9

    return position;
}

jQuery.fn.getSelection = function () {
    var input = this[0];
    var text;

    if (window.getSelection
        && typeof input.selectionStart === 'number' 
        && typeof input.selectionEnd === 'number') {
        text = input.value.substring(input.selectionStart, input.selectionEnd);
    } 
    // @todo support <IE9

    return text;
}