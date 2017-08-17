module.exports = [{
    path: '/',
    handler: 'Front',
    isStatic: true
}, {
    path: '/tasks',
    handler: 'Front:getTasks',
    isStatic: true
}, {
    path: '/tasks/create',
    handler: 'Front:createTask',
    isStatic: true
}, {
    path: '/tasks/update/:id',
    handler: 'Front:updateTask'
}, {
    path: '/tasks/destroy/:id',
    handler: 'Front:destroyTask'
}];
