define([
    'models/base/Model'

], function(BaseModel) {
    "use strict";

    /**
     * @class
     * @classdesc ImageData storage
     */
    var PhotoStorage = BaseModel.extend(
        /** @lends PhotoStorage.prototype */
        {
        defaults: {
            data: []
        }
    });

    return PhotoStorage;
});
