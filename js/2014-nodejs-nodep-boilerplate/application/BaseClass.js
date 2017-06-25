"use strict";

var extend = require('util')._extend;

function BaseClass() {
    this.initialize.apply(this, arguments);
}

BaseClass.prototype.initialize = function() {};

BaseClass.extend = function(definition, statics) {
	statics || (statics = {});

    var Base = this;

    var Descendant = function () {
        Base.apply(this, arguments);
    };

    Descendant.prototype = Object.create(Base.prototype);
    Descendant.prototype.constructor = Descendant;

    extend(Descendant.prototype, definition);

	statics.extend = BaseClass.extend;
	extend(Descendant, statics);

    return Descendant;
};

module.exports = BaseClass;
