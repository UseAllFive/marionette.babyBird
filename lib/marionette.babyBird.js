/* # marionette.babyBird

Brought to you by [Use All Five, Inc.](http://www.useallfive.com)

```
Author: Justin Anastos <janastos@useallfive.com>
Author URI: [http://www.useallfive.com](http://www.useallfive.com)
Repository: https://github.com/UseAllFive/marionette.babyBird
```

Recursively run toJSON on deeply nested models/collections for Marionette views
to provide a plain JavaScript object to templates.

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
            return originalRender.call(this, template, convertToObject(data));
        } catch (error) {
            // There was an error in the modified render.

            // Report the error in the console.
            /*jshint devel: true */
            console.error(error);

            // Return original function instead.
            return originalRender.apply(this, arguments);
        }
    };

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
            if (_.isObject(value)) {
                // Value is an `object`, recurse through it's properties.
                data[index] = convertToObject(value);
            }
        });

        return data;
    }

    return Marionette;
}));
