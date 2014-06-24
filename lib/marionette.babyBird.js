/*

██╗   ██╗███████╗███████╗     █████╗ ██╗     ██╗         ███████╗██╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔════╝    ██╔══██╗██║     ██║         ██╔════╝██║██║   ██║██╔════╝
██║   ██║███████╗█████╗      ███████║██║     ██║         █████╗  ██║██║   ██║█████╗
██║   ██║╚════██║██╔══╝      ██╔══██║██║     ██║         ██╔══╝  ██║╚██╗ ██╔╝██╔══╝
╚██████╔╝███████║███████╗    ██║  ██║███████╗███████╗    ██║     ██║ ╚████╔╝ ███████╗
 ╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═══╝  ╚══════╝

Author: Justin Anastos <janastos@useallfive.com>
Author URI: http://useallfive.com/

Description: Flatten deeply nested Backbone models and collections into a plain JavaScript object when using built-in Marionette.Renderer.
Package URL: https://github.com/UseAllFive/marionette.babyBird

*/
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

    // Override the `Marionette.Renderer.render` function to flatten deeply
    // nested collections and models.
    Marionette.Renderer.render = function(template, data) {
        return originalRender.call(this, template, convertToObject(data));
    };

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
}));
