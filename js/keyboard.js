function Keyboard(options) {
    return {
        OPTIONS: {
            boardContainer: null,
            initInput: null
        },
        init: function () {
            var that = this;
            var initInput;
            var layout;

            this.options = $.extend({}, this.OPTIONS, options);
            layout = this.options.layout ? this.options.layout : this.basicLayout;
            this.currentInput = this.options.initInput;
            this.currentCursorPosition = 0;

            this.currentInput.focus();
            this.board = this.generateBoard(layout);
            
            // input focus handler
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
        /**
         * Create the keyboard DOM.
         * The layout parameter is an object which 
         * is grouped by modifiers, each containing 
         * rows of keys which are displayed together.
         */
        generateBoard: function (layout) {
            var that = this;
            var $boardContainer = this.options.boardContainer;
            var $board = $('<div>', {'class': 'board'});
            var modifier;
            
            for (modifier in layout) {
                var $modContainer = $('<div>', {'class':  'board-mod ' + modifier });

                $.each(layout[modifier], function (rowName, keys) {
                    var $row = $('<div>', {'class': 'flex-row'});
                    var i = 0;

                    for (i; i < keys.length; i += 1) {
                        var $button = that.generateButton(keys[i]);
                        
                        $row.append($button);
                    }

                    $modContainer.append($row); 
                });

                $board.append($modContainer);
            }

            return $boardContainer.append($board);;
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
            var text = keyData.value;
            var $key = $('<div>', {'class': 'key', text: text});
            var $button = $('<div>', {'class': 'button'});
            var buttonClass = keyData.buttonClass;
            var onclick = keyData.onclick ? this[keyData.onclick]() : this.write(keyData.value);
            
            if (buttonClass) $button.addClass(buttonClass);
            $button.on('click', onclick).append($key);

            return $button;
        },
        write: function (character) {
            var that = this;

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
            var that = this;

            return function () {
                var text = that.currentInput.val();
                var position = that.currentCursorPosition;
                var selection = that.currentSelection;
                var output = (function () {
                    if (selection) {
                        var tail = text.slice(text.indexOf(selection) + selection.length);
                        return [text.slice(0, text.indexOf(selection)), tail].join('')
                    } else {
                        return [text.slice(0, position - 1), text.slice(position)].join('');
                    }
                }());

                that.currentInput.val(output);
                if (!selection) 
                    that.currentCursorPosition -= 1;
                if (that.currentCursorPosition < 0)
                    that.currentCursorPosition = 0;
                that.currentSelection = null;
            };
        },
        basicLayout: {
            uppercase: {
                row1: [{ value: 'Q' },{ value: 'W' },{ value: 'E' },{ value: 'R' },{ value: 'T' },{ value: 'Y' },{ value: 'U' },{ value: 'I' },{ value: 'O' },{ value: 'P' }],
                row2: [{ value: 'A' },{ value: 'S' },{ value: 'D' },{ value: 'F' },{ value: 'G' },{ value: 'H' },{ value: 'J' },{ value: 'K' },{ value: 'L' }],
                row3: [{ value: 'Z' },{ value: 'X' },{ value: 'C' },{ value: 'V' },{ value: 'B' },{ value: 'N' },{ value: 'M' }]
            },
            // lowercase: {
            //     row1: [{ value: 'q' },{ value: 'w' },{ value: 'e' },{ value: 'r' },{ value: 't' },{ value: 'y' },{ value: 'u' },{ value: 'i' },{ value: 'o' },{ value: 'p' }],
            //     row2: [{ value: 'a' },{ value: 's' },{ value: 'd' },{ value: 'f' },{ value: 'g' },{ value: 'h' },{ value: 'j' },{ value: 'k' },{ value: 'l' }],
            //     row3: [{ value: 'z' },{ value: 'x' },{ value: 'c' },{ value: 'v' },{ value: 'b' },{ value: 'n' },{ value: 'm' }]
            // },
            numeric: {
                row1: [{ value: '1' },{ value: '2' },{ value: '3' }],
                row2: [{ value: '4' },{ value: '5' },{ value: '6' }],
                row3: [{ value: '7' },{ value: '8' },{ value: '9' }],
                row4: [{ value: '0' }]
            },
            special: {
                row1: [{ value: "Delete", buttonClass: 'del', onclick: 'del' }]
            }
        }
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