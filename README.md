# marionette.babyBird

Brought to you by [Use All Five, Inc.](http://www.useallfive.com)

```
Author: Justin Anastos <janastos@useallfive.com>
Author URI: [http://www.useallfive.com](http://www.useallfive.com)
Repository: https://github.com/UseAllFive/marionette.babyBird
```

Flatten deeply nested Backbone [models](http://backbonejs.org/#Model) and [collections](http://backbonejs.org/#Collection) into a plain JavaScript object when using built-in [Marionette.Renderer](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.renderer.md).

### To Use
Include this file before your application attempts to render any templates.

### Dependencies
This module requires [Backbone](http://backbonejs.org), [Marionette](http://marionettejs.com/), and [Underscore](http://underscorejs.org/).

## Limitations
There is no checking done to catch circular dependencies.

## Annotated Source Code
To generate annotated source code, run `grunt groc:local`.

You must install Pygments on your system as it is a dependency of [groc](https://github.com/nevir/groc):

```
pip install Pygments
```
