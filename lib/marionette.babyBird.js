/* # marionette.babyBird

Brought to you by [Use All Five, Inc.](http://www.useallfive.com)

```
Author: Justin Anastos <janastos@useallfive.com>
Author URI: [http://www.useallfive.com](http://www.useallfive.com)
Repository: https://github.com/UseAllFive/marionette.babyBird
```

Recursively run toJSON on deeply nested models/collections for Marionette
views to provide a plain JavaScript object to templates.

*/

// ## Factory
// Be compatible with requirejs.
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone', 'marionette', 'underscore'], factory);
    } else {
        // Use browser globals. Will fail if they are not yet loaded.
        /*globals Backbone, Marionette, _ */
        factory(Backbone, Marionette, _);
    }
}(function(Backbone, Marionette, _) {

    // The minimum numbers of words at the end of a string required to make
    // it not an orphan.
    // FIXME: Make this configurable.
    var MINIMUM_WORDS_AT_END = 2;

    // Define the character to replace the spaces to remove orphans. It must
    // be a string literal. Using something like `&nbsp;` will not work
    // because Handlebars will escape the string so you will see a literal
    // `&nbsp;` instead of ` `.
    var ORPHAN_REPLACEMENT_CHARACTER = String.fromCharCode(160);

    // Save the original `Marionette.Renderer.render`  function so we can call
    // it later.
    var originalRender = Marionette.Renderer.render;

    // ## Marionette.Renderer.render
    // Override the `Marionette.Renderer.render` function to flatten deeply
    // nested collections and models.
    Marionette.Renderer.render = function(template, data) {
        // Wrap the modified render in a `try` block incase something goes
        // wrong. That could include something wrong with the data, the
        // `convertToObject` function, or some unforseen change in Marionette
        // or Backbone. Regardless, if the modified version fails, report the
        // error and return the result of the original function.
        try {
            var objectData;

            // Convert the input into a plain JavaScript object.
            objectData = convertToObject(data);

            // Remove orphans.
            // FIXME: Make this optional with some kind of configuration.
            objectData = removeOrphans(objectData);

            // Pass the newly modified `objectData` into the original
            // `Marionette.Renderer.render` function.
            return originalRender.call(this, template, objectData);
        } catch (error) {
            // There was an error in the modified render.

            // Report the error in the console.
            /*jshint devel: true */
            console.error(error);

            // Return original function instead.
            return originalRender.apply(this, arguments);
        }
    };

    /*
    ## removeOrphans
    Recursively iterate through the `data` object, replacing every string
    with a version with orphans removed. The original `data` is never
    modified; a cloned version is generated, modified, and returned.
     */
    function removeOrphans(data) {

        // Define a callback function to generate the replacement string
        // in the loop later.
        function regexCallback(wholeMatch, match) {
            return ORPHAN_REPLACEMENT_CHARACTER + match;
        }

        // Loop through each element in `data`.
        _.each(data, function(value, index) {
            var i;

            if (typeof value === 'object') {
                // `value` is an `object`, so recurse through it's children.
                data[index] = removeOrphans(value);
            } else if (typeof value === 'string') {
                // Strip off one word at a time and replace it with the
                // result of `regexCallback`. We loop
                // `MINIMUM_WORDS_AT_END - 2` times because if we want
                // two words in the last string, we only need one replaced
                // space. (Note that we are using a 0 indexed counter,
                // that's why we use `MINIMUM_WORDS_AT_END - 1` when we want
                // `MINIMUM_WORDS_AT_END - 2` iterations.)
                for (i = 0; i < MINIMUM_WORDS_AT_END - 1; i += 1) {
                    value = value.replace(/ ([^ ]+)$/, regexCallback);
                }

                // Assign the original `data[index]`.
                data[index] = value;
            }
        });

        return data;
    }

    // ## convertToObject
    // Convert deeply nexted models and collections into a generic javascript
    // object.
    function convertToObject(data) {
        var id;

        if (data instanceof Backbone.Collection) {
            // `data` is a `Backbone.Collection`. Run `toJSON()` and then
            // allow recursive behavior to continue.
            // console.log('collection');
            data = data.toJSON();
        } else if (data instanceof Backbone.Model) {
            // `data` is a `Backbone.Model`. Read the `id` property and add
            // `it to the converted object just incase we are using
            // `idAttribute`. Otherwise, we won't have the `id` later.
            // `Then, read the attributes and allow for recursive searching.
            id = data.id;
            data = data.toJSON();
            data.id = id;
        } else {
            // `data` is neither a `Backbone.Model` or
            // `Backbone.Collection`. Clone `data` to not alter the
            // `original.
            data = _.clone(data);
        }

        // Iteratively search through the data.
        _.each(data, function(value, index) {
            if (typeof value === 'object') {
                // Value is an `object`, recurse through it's properties.
                data[index] = convertToObject(value);
            }
        });

        return data;
    }

    return Marionette;
}));
