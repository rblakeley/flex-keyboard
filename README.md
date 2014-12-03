## flex-keyboard

Flex keyboard is a responsive on-screen keyboard.


### Files

```
├── css
|   ├── [normalize-3.0.2.css](https://github.com/necolas/normalize.css/)
|   ├── [fontello-embedded.css](https://github.com/fontello/fontello)
|   ├── keyboard.css
|   └── main.css
├── js
|   ├── vendor
|       ├── [modernizr-2.8.3.min.js](https://github.com/Modernizr/Modernizr)
|       └── [jquery-2.1.1.min.js](https://github.com/jquery/jquery)
|   ├── keyboard.js
|   └── main.js
└── index.html
```

### Todo

- [ ] visual state of clear button
- [x] caps regex should not match 'GO'
- [ ] text selection
    - [ ] cursor left -> selection start
    - [ ] cursor right -> selection end
    - [ ] accomodate physical keyboard selection
    - [ ] refactor currentSelection = null
    - [x] cancel selection if cursor moves
- [ ] keyboard arrow keys trigger buttons
- [ ] allow normal command key bindings
- [ ] refactor modifier to array of arrays
- [ ] disable tap zoom
- [ ] multiple inputs
- [ ] docs
    - [ ] add optional layout parameter usage
    - [ ] add rem and em usage
    - [ ] add fontello usage
    - [ ] browser support: IE9+


#### Acknowledgement

This project was originally forked and detached from [https://github.com/sdeering/onscreenkeyboard](https://github.com/sdeering/onscreenkeyboard).