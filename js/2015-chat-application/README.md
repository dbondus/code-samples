# Basic Chat Application
Chat application with 2 additional screens: PhotoGallery and Settings 
    
# Installation
    copy/past content from the backend/public directory to any directory served by a webserver
         
or you can run a provided simple chat server

    $ npm install
    $ npm start

# Structure
### Directories
    backend > holds the server side related code
        | public > holds files ready for production 
    frontend > holds source code of the client side
        | js 
            | application > app related files
            | lib > app independent files
            | vendor > 3rd party libraries
        | sass
        | tests
        
### Architecture
     * major application parts communicate only through Mediator instance
     * persistent instances are stored in "services" directory
     * frontend/js/application.js is the main entry point of application 
     * frontend/js/require.config describes path shortcuts and 3rd party libraries location
     * frontend/js/view/Layout takes control over screen views life circle and responds to navigation requests
    
# Features
### Chat
     * auto scrolling of the container with messages
     * all messages are saved while the user is working with other application tabs  
     * new message notification
     
### Gallery
     * mouse/touch swipe gesture to navigate through photos
     * all images are downloaded in the background 
     * individual image state is saved while the user is working with other application tabs
     * scaling down does not require image reloading
     * scaling up requires image reloading
     * it continuously starts over failed downloads while user is looking at the image place holder

### Settings
     * 2 sections which can be expanded 
     * slider to change width of photos in gallery
     * slider to change height of photos in gallery
     * sliders handle both mouse and touch
     * sliders min/max value may be changed (in code)
     * input field to update user's nickname
     * basic validation of user's nickname
