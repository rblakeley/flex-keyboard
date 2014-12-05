(function () {
    'use strict';

    function Keyboard(options) {
        return {
            OPTIONS: {
                inputContainer: null,
                boardContainer: null,
                layout: null
            },
            init: function () {
                this.options = $.extend({}, this.OPTIONS, options);
                this.currentInput = this.generateInput(this.options.inputContainer);
                this.board = this.generateBoard(this.options.boardContainer,
                                                this.options.layout || this.basicLayout);
                this.currentCursorPosition = 0;
            },
            generateInput: function (container) {
                var that = this,
                    $input = $('<input>', {
                        'id': 'search_input',
                        'name': 'search_input',
                        'type': 'text',
                        'placeholder': 'Search for Product',
                        'max-length': 80 
                    }),
                    $spyglass = $('<i>', {'class': 'icon-spyglass'}),
                    $btnClear = $('<i>', {'class': 'icon-clear'}),
                    $btnCancel = $('<button>', {'class': 'cancel', html: "cancel"});

                $input.on('focus, click', function () {
                    var $this = that.currentInput = $(this);
                    that.currentCursorPosition = $this.getCursorPosition();
                    that.currentSelection = $this.getSelection();
                    container.addClass('focused');
                });

                $input[0].onkeydown = function (e) {
                    var text = String.fromCharCode(e.keyCode),
                        pattern = /^[ A-Za-z0-9_@.\/#&+\-]*$/,
                        flag = pattern.test(text);

                    if (e.which === 8) {
                        e.preventDefault();
                        that.del()();
                    } else if (flag) {
                        e.preventDefault();
                        that.write(text)();
                    }
                };

                $btnClear.on('click', function () {
                    that.clear();
                });
                $btnCancel.on('click', function () {
                    that.cancel();
                });

                container.append($input);
                container.append($spyglass);
                container.append($btnClear);
                container.append($btnCancel);

                return $input;
            },
            /**
             * Create the keyboard DOM.
             * The layout parameter is an object which 
             * contains character sets, each containing
             * rows of keys which are displayed together.
             */
            generateBoard: function (container, layout) {
                var that = this,
                    characterSet,
                    $charSetContainer,
                    $board = $('<div>', {'class': 'board'});

                for (characterSet in layout) {
                    if (layout.hasOwnProperty(characterSet)) {
                        $charSetContainer = $('<div>', {'class':  'character-set ' + characterSet });

                        $.each(layout[characterSet], function createRow(rowName, keys) {
                            var $row = $('<div>', {'class': 'flex-row'}),
                                i = 0,
                                $button;

                            for (i; i < keys.length; i += 1) {
                                $button = that.generateButton(keys[i]);

                                $row.append($button);
                            }

                            $charSetContainer.append($row);
                        });

                        $board.append($charSetContainer);
                    }
                }

                container.append($board);

                return $board;
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
            clear: function () {
                this.currentInput.val("").focus();
                this.currentCursorPosition = 0;
                this.options.inputContainer.removeClass('not-empty');
            },
            cancel: function () {
                this.clear();
                this.options.inputContainer.removeClass('focused');
            },
            submit: function () {
                var that = this;

                return function () {
                    that.currentInput.trigger('submit');
                    that.currentSelection = null;
                };
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

                    that.currentInput.val(output).focus();
                    that.currentCursorPosition += 1;
                    that.currentInput.setSelection(that.currentCursorPosition);
                    that.options.inputContainer.addClass('not-empty');
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

                    that.currentInput.val(output).focus();
                    if (!selection) { that.currentCursorPosition -= 1; }
                    if (that.currentCursorPosition < 0) { that.currentCursorPosition = 0; }
                    that.currentInput.setSelection(that.currentCursorPosition);
                    if (!output) { that.options.inputContainer.removeClass('not-empty'); }
                    that.currentSelection = null;
                };
            },
            toggleCaps: function () {
                var that = this;

                return function () {
                    var $caps = $(this),
                        $keys = $('.key'),
                        pattern = /^[A-z]$/,
                        character,
                        flag;

                    $keys.each(function (index, element) {
                        var $button = $(element).parent('.button');

                        if ($caps.hasClass('off')) {
                            character = element.innerHTML.toUpperCase();
                        } else {
                            character = element.innerHTML.toLowerCase();
                        }

                        flag = pattern.test(character);

                        if (flag) {
                            element.innerHTML = character;
                            $button.off('click');
                            $button.on('click', that.write(character));
                        }
                    });

                    $caps.toggleClass('off');
                    if ($caps.hasClass('off')) {
                        $caps.html("<i class='icon-caps-off'></i>");
                    } else {
                        $caps.html("<i class='icon-caps'></i>");
                    }

                    that.currentSelection = null;
                };
            },
            cursorLeft: function () {
                var that = this;

                return function () {
                    that.currentCursorPosition -= 1;
                    if (that.currentCursorPosition < 0) { that.currentCursorPosition = 0; }

                    that.currentInput.focus();
                    that.currentInput.setSelection(that.currentCursorPosition);
                    that.currentSelection = null;
                };
            },
            cursorRight: function () {
                var that = this;

                return function () {
                    that.currentCursorPosition += 1;
                    if (that.currentCursorPosition > that.currentInput.val().length) {
                        that.currentCursorPosition = that.currentInput.val().length;
                    }

                    that.currentInput.focus();
                    that.currentInput.setSelection(that.currentCursorPosition);
                    that.currentSelection = null;
                };
            },
            basicLayout: {
                uppercase: {
                    row1: [{ value: "Q" }, { value: "W" }, { value: "E" }, { value: "R" }, { value: "T" }, { value: "Y" }, { value: "U" }, { value: "I" }, { value: "O" }, { value: "P" }, { value: "<i class='icon-delete'></i>", buttonClass: 'delete', onclick: 'del' }],
                    row2: [{ value: "A" }, { value: "S" }, { value: "D" }, { value: "F" }, { value: "G" }, { value: "H" }, { value: "J" }, { value: "K" }, { value: "L" }, { value: "\"" }, { value: "GO", buttonClass: 'go', onclick: 'submit' }],
                    row3: [{ value: "<i class='icon-caps'></i>", buttonClass: "caps", onclick: "toggleCaps" }, { value: "Z" }, { value: "X" }, { value: "C" }, { value: "V" }, { value: "B" }, { value: "N" }, { value: "M" }, { value: "," }, { value: "."}, { value: "\'" }, { value: "+" }],
                    row4: [{ value: "", buttonClass: "blank" }, { value: "&nbsp;", buttonClass: 'spacebar' }, { value: "!" }, { value: "?" }, { value: "-" }]
                },
                numeric: {
                    row1: [{ value: "7" }, { value: "8" }, { value: "9" }],
                    row2: [{ value: "4" }, { value: "5" }, { value: "6" }],
                    row3: [{ value: "1" }, { value: "2" }, { value: "3" }],
                    row4: [{ value: "<i class='icon-cursor-left'></i>", buttonClass: "cursor-left", onclick: "cursorLeft" }, { value: "0" }, { value: "<i class='icon-cursor-right'></i>", buttonClass: "cursor-right", onclick: "cursorRight" }]
                }
            }
        };
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Keyboard;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Keyboard;
    } else {
        window.Keyboard = Keyboard;
    }

}());

jQuery.fn.getCursorPosition = function () {
    var input = this[0],
        position;

    if (typeof input.selectionStart === 'number') {
        position = input.selectionStart;
    }

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

    return text;
};

jQuery.fn.setSelection = function () {
    var input = this[0],
        start = arguments[0],
        end = arguments[1];

    if (!end) { end = start; }
    input.setSelectionRange(start, end);
};