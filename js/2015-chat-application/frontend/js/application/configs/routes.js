define([
    'views/user/Chat',
    'views/user/Photos',
    'views/user/Settings'
], function (ChatView, PhotosView, SettingsView) {
    return {
        '(/)(chat)': {
            name: 'chat',
            view: ChatView
        },
        'photos': {
            name: 'photos',
            view: PhotosView
        },
        'settings': {
            name: 'settings',
            view: SettingsView
        }
    };
});
