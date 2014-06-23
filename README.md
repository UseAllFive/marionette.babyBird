# marionette.babyBird

Flatten deeply nested Backbone [models](http://backbonejs.org/#Model) and [collections](http://backbonejs.org/#Collection) into a plain JavaScript object when using built-in [Marionette.Renderer](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.renderer.md).

## To Use
Include this file before your application attempts to render any templates.

## Dependencies
This module requires [Backbone](http://backbonejs.org), [Marionette](http://marionettejs.com/), and [Underscore](http://underscorejs.org/).

## Limitations
There is no checking done to catch circular dependencies.

## Updating Annotated Source Code
To update the annotated source code, you must install Pygments on your system
as it is a dependency of `groc`.

```
sudo pip install Pygments
```
