define([
    'views/Start'

], function (StartView) {
    return {
        '(/)': {
            name: 'start',
            view: StartView,
            permissions: ['guest', 'user']
        }
    };
});
