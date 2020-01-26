# Chat app.
  NodeJS app that uses Express server and Socket.io for RTC between users and allows to create and/or join chat rooms setting up an username.
  Once inside a chat room the users can send text messages only to all the users connected to that chat room. All the messages have the timestamp.
  Also they can send location messages that shows their current location in an Google's Maps `iframe` (if they allow access to geolocation API).
  Users can see all the sockets (usernames) connected to the chat room and the total number of them.
  A functional approach was implemented.
  The front-end is a plain JavaScript with Mustache templating for backend data.
  The design and CSS is very basic (generic) since it's not the goal of this project.
  
## Objective:
  * Project for leaning socket.io basics and practicing some Express server.
  * Implements some geolocation API feature.
  * Work with Mustache templating.
  * Exploring Back-end deployment: Heroku.
  * The idea/code is for work on it adding new features to develop socket.io knowledge.
  
## Tags:
  * NodeJS and Express.
  * Socket.io.
  * Mustache.
  * localStorage.
  * Modules: UUID, Moment, qs.
  
## Todo:
- [ ] Add Webpack and Babel.
- [ ] Add DB.
- [ ] OOP refactoring.
- See `issues` for more future implementations.
