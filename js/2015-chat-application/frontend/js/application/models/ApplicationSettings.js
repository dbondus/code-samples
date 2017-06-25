define([
    'models/base/Model',
    'models/User'

], function(BaseModel, UserModel) {
    "use strict";

    /**
     * @class
     * @classdesc Application settings
     */
    var ApplicationSettings = BaseModel.extend(
        /** @lends ApplicationSettings.prototype */
        {
        defaults: {
            user: new UserModel(),

            photoWidth: 640,
            photoHeight: 480
        },

        /**
         * Returns current user name
         *
         * @returns {string}
         */
        getCurrentUserName: function() {
            return this.get('user').get('name');
        }
    });

    return ApplicationSettings;
});
