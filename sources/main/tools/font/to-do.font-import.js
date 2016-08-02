//Not ready to use

require('./fonts-import.styl');

var FontLoader = require('./font-loader');

var fontLoader = new FontLoader([
    "fontFamilyName",
], {
    "fontLoaded": function(font) {
        // One of the fonts was loaded
        // console.log("font loaded: " + font.family);
    },
    "complete": function(error) {
        if (error !== null) {
            // Reached the timeout but not all fonts were loaded
            console.log(error.message);
            console.log(error.notLoadedFonts);
        } else {
            // All fonts were loaded
            //console.log("all fonts were loaded");
            app.sizeClassHelper.emitResize();
        }
    }
}, 5000);

fontLoader.loadFonts();