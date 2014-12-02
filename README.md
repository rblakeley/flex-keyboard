# flex-keyboard

Flex keyboard is an on-screen keyboard. The board is generated in "modifiers" which are character sets.

## File Structure

├── css  
|   ├── [normalize-3.0.2.css](https://github.com/necolas/normalize.css/)  
|   ├── keyboard.css  
|   └── main.css  
├── js  
|   ├── vendor  
|       ├── [jquery-2.1.1.min.js](https://github.com/jquery/jquery)  
|       └── [modernizr-2.8.3.min.js](https://github.com/Modernizr/Modernizr)  
|   ├── keyboard.js  
|   └── main.js  
└── index.html


## Todo

- [ ] fix cursor position to end of selection when cursor right
- [x] toggle caps
- [ ] refactor modifier to array of arrays
- [ ] disable tap zoom  
- [ ] docs
    - [ ] add optional layout parameter usage
    - [ ] add rem and em usage
    - [ ] add fontello usage
    - [ ] warning for unsupported browsers: <IE9


## Browser Support

This is not supported by <IE9. An error message or warning will appear with outdated browsers.


## Acknowledgement

This project was originally forked and detached from [https://github.com/sdeering/onscreenkeyboard](https://github.com/sdeering/onscreenkeyboard).