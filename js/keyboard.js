function Keyboard(options) {
    return {
        OPTIONS: {
            boardContainer: null,
            initInput: null
        },
        init: function () {
            var that = this;

            this.options = $.extend({}, this.OPTIONS, options);
            this.board = this.generateBoard(this.options.layout || this.basicLayout);
            this.currentInput = this.options.initInput;
            this.currentCursorPosition = 0;
            this.currentInput.focus();

            // input focus handler
            $(':input').not('[type="reset"], [type="submit"]')
                .on('focus, click', function () {
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
        /**
         * Create the keyboard DOM.
         * The layout parameter is an object which 
         * is grouped by modifiers, each containing 
         * rows of keys which are displayed together.
         */
        generateBoard: function (layout) {
            var that = this,
                $boardContainer = this.options.boardContainer,
                $board = $('<div>', {'class': 'board'}),
                modifier,
                $modContainer;

            for (modifier in layout) {
                if (layout.hasOwnProperty(modifier)) {
                    $modContainer = $('<div>', {'class':  'board-mod ' + modifier });

                    $.each(layout[modifier], function createRow(rowName, keys) {
                        var $row = $('<div>', {'class': 'flex-row'}),
                            i = 0,
                            $button;

                        for (i; i < keys.length; i += 1) {
                            $button = that.generateButton(keys[i]);

                            $row.append($button);
                        }

                        $modContainer.append($row);
                    });

                    $board.append($modContainer);
                }
            }

            return $boardContainer.append($board);
        },
        /**
         * Create the key DOM.
         * keyData is an object whose 'value' property
         * is the string which becomes the button label. 
         * keyData has optional properties:
         * 'buttonClass' for a custom CSS selector, and 
         * 'onclick' for custom event handling. The value
         * for 'onclick' in keyData should be a string
         * which matches the name of a Keyboard method.
         */
        generateButton: function (keyData) {
            var text = keyData.value,
                $key = $('<div>', { 'class': 'key', html: text }),
                $button = $('<div>', { 'class': 'button' }),
                buttonClass = keyData.buttonClass,
                onclick = keyData.onclick ? this[keyData.onclick]() : this.write($key.text());

            if (buttonClass) { $button.addClass(buttonClass); }
            $button.on('click', onclick).append($key);

            return $button;
        },
        write: function (character) {
            var that = this;

            return function () {
                var text = that.currentInput.val(),
                    position = that.currentCursorPosition,
                    selection = that.currentSelection,
                    output = (function () {
                        if (selection) {
                            var tail = text.slice(text.indexOf(selection) + selection.length);
                            return [text.slice(0, text.indexOf(selection)), character, tail].join('');
                        }
                        return [text.slice(0, position), character, text.slice(position)].join('');
                    }());

                that.currentInput.val(output);
                that.currentCursorPosition += 1;
                that.currentSelection = null;
            };
        },
        del: function () {
            var that = this;

            return function () {
                var text = that.currentInput.val(),
                    position = that.currentCursorPosition,
                    selection = that.currentSelection,
                    output = (function () {
                        if (selection) {
                            var tail = text.slice(text.indexOf(selection) + selection.length);
                            return [text.slice(0, text.indexOf(selection)), tail].join('');
                        }
                        return [text.slice(0, position - 1), text.slice(position)].join('');
                    }());

                that.currentInput.val(output);
                if (!selection) { that.currentCursorPosition -= 1; }
                if (that.currentCursorPosition < 0) { that.currentCursorPosition = 0; }
                that.currentSelection = null;
            };
        },
        submit: function () {
            // @todo
        },
        toggleCaps: function () {
            // @todo
        },
        cursorLeft: function () {
            // @todo
        },
        cursorRight: function () {
            // @todo
        },
        basicLayout: {
            uppercase: {
                row1: [{ value: "Q" }, { value: "W" }, { value: "E" }, { value: "R" }, { value: "T" }, { value: "Y" }, { value: "U" }, { value: "I" }, { value: "O" }, { value: "P" }, { value: "<i class='icon-delete'></i>", buttonClass: 'delete', onclick: 'del' }],
                row2: [{ value: "A" }, { value: "S" }, { value: "D" }, { value: "F" }, { value: "G" }, { value: "H" }, { value: "J" }, { value: "K" }, { value: "L" }, { value: "\"" }, { value: "GO", buttonClass: 'go', onclick: 'submit' }],
                row3: [{ value: "<i class='icon-caps'></i>", buttonClass: "caps", onclick: "toggleCaps" }, { value: "Z" }, { value: "X" }, { value: "C" }, { value: "V" }, { value: "B" }, { value: "N" }, { value: "M" }, { value: "," }, { value: "."}, { value: "\'" }, { value: "+" }],
                row4: [{ value: "", buttonClass: "blank" }, { value: "&nbsp;", buttonClass: 'spacebar' }, { value: "!" }, { value: "?" }, { value: "-" }]
            },
            // lowercase: {
            //     row1: [{ value: "q" }, { value: "w" }, { value: "e" }, { value: "r" }, { value: "t" }, { value: "y" }, { value: "u" }, { value: "i" }, { value: "o" }, { value: "p" }, { value: "Delete", buttonClass: 'del', onclick: 'del' }],
            //     row2: [{ value: "a" }, { value: "s" }, { value: "d" }, { value: "f" }, { value: "g" }, { value: "h" }, { value: "j" }, { value: "k" }, { value: "l" }],
            //     row3: [{ value: "z" }, { value: "x" }, { value: "c" }, { value: "v" }, { value: "b" }, { value: "n" }, { value: "m" }]
            // },
            numeric: {
                row1: [{ value: "7" }, { value: "8" }, { value: "9" }], 
                row2: [{ value: "4" }, { value: "5" }, { value: "6" }],
                row3: [{ value: "1" }, { value: "2" }, { value: "3" }],
                row4: [{ value: "<i class='icon-cursor-left'></i>", buttonClass: "cursor-left", onclick: "cursorLeft" }, { value: "0" }, { value: "<i class='icon-cursor-right'></i>", buttonClass: "cursor-right", onclick: "cursorRight" }]
            },
        }
    };
}

jQuery.fn.getCursorPosition = function () {
    var input = this[0],
        position;

    if (typeof input.selectionStart === 'number') {
        position = input.selectionStart;
    }
    // @todo support <IE9

    return position;
};

jQuery.fn.getSelection = function () {
    var input = this[0],
        text;

    if (window.getSelection
            && typeof input.selectionStart === 'number'
            && typeof input.selectionEnd === 'number') {
        text = input.value.substring(input.selectionStart, input.selectionEnd);
    }
    // @todo support <IE9

    return text;
};