define([
    'models/base/Model'

], function (BaseModel) {

    /**
     * @class
     * @classdesc Chat user
     */
    var User = BaseModel.extend(
        /**
         * @lends User.prototype
         */
        {
            defaults: {
                name: 'Anonymous ' + Math.floor(Math.random() * 1000)
            }
        });

    return User;
});
