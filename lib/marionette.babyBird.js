/*
# marionette.babyBird

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

        if (data instanceof Backbone.Model) {
            // Data is a model, return it's `toJSON()`.
            return convertToObject(data.toJSON());
        } else {
            // `data` is a plain object. Iterate through properties looking
            // for instances of `Backbone.Model`.

            // Clone `data` to not alter the original.
            data = _.clone(data);

            _.each(data, function(value, index) {
                if (value instanceof Backbone.Model) {
                    // Value is a model. Recurse.
                    data[index] = convertToObject(value);
                }
            });
        }

        return data;
    }

    return Marionette;
}));
