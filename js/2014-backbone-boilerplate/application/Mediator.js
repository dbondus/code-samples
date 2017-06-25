define([
    'backbone',
    'underscore'
], function(Backbone, _) {
    var Mediator = function() {
    };

    _.extend(Mediator.prototype, Backbone.Events, {
        navigate: function(location, triggerRoute, replaceHistoryEntry) {
			this.trigger(this.EVENT_NAVIGATE, {
				target: location,
                options: {
                    trigger: triggerRoute,
                    replace: replaceHistoryEntry
                }
            });
        },

		EVENT_NAVIGATE: 'navigate',

		EVENT_VIEW_CHANGE: 'change_view'
    });

    return Mediator;
});
