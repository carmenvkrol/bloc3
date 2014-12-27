listy app
=============

Single-page app built with [AngularJS](https://angularjs.org/), [Express](http://expressjs.com/), [Mongoose](http://mongoosejs.com/), and [Node.js](http://nodejs.org/) using the [MeanJS Yeoman scaffolding](http://meanjs.org/).

Users can create an account in which they create and edit bookmarks.  The bookmarks can include a link, comments, and tags.  Users can search bookmarks and sort them by tags.  The tags can be edited and deleted.

Here's the [demo] (https://listy-cvk.herokuapp.com/#!/).


Configuration
------------
Configuring this project should be consistent across Mac (local) and Vagrant.  You should already have [Node.js](http://nodejs.org) and [MongoDB](http://www.mongodb.org/) installed before cloning.

Start by cloning the repository
```
$ git clone https://github.com/carmenvkrol/bloc3.git
```

This app uses [Grunt](http://gruntjs.com/) to run tasks.  Install the Grunt Command Line Interface (`grunt-cli`) locally on your machine.
```
$ npm install -g grunt-cli
```

Once that's complete, install the remaining dependencies by running
```
$ npm install
```



Running the Application
------------
Run the application using

```
$ grunt
```

The application runs on port 3000 (configured in [/config/env/all.js](https://github.com/carmenvkrol/bloc3/blob/master/config/env/all.js)).  To change the port, modify the number highlighted below
```
'use strict';

module.exports = {
  app: {
    title: 'bloc3',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'MongoDB, Express, AngularJS, Node.js'
  },
  port: process.env.PORT || 3000, //change this value to the desired port number
...

```


Directory Structure and Grunt
------------
```
bloc3/
 |__app/ #server-side files that handle functionality of bookmarks, tags, and user authentication
 |__config/ #server-side files that handle configuration of app, including local port
 |__node_modules/
 |__public/ #client-side files in AngularJS and LESS
 |  |__dist/ #production mode files
 |  |__img/
 |  |__lib/
 |  |__modules/ #development mode files
 |  |  |__articles/ #bookmarks and tags
 |  |  |__core/ #home (landing)
 |  |  |__users/ #sign in and sign up 
 Gruntfile.js

```

Grunt looks for files using a defined pattern so that it knows what to compile and copy and where to put it. To edit the files that Grunt watches, look at the array of files in the watch task in [Gruntfile.js](https://github.com/carmenvkrol/bloc3/blob/master/gruntfile.js). The default watched files are:

```
var watchFiles = {
    serverViews: ['app/views/**/*.*'], 
    serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/*.js', 'public/modules/*/*.js', 'public/modules/*/*[!tests]*/*.js'],
    clientCSS: ['public/modules/**/*.css'],
    mochaTests: ['app/tests/**/*.js']
  };

```


LESS
------------
This app uses the CSS pre-processor [LESS](http://lesscss.org/) in order to facilitate styling with [Bootstrap](http://getbootstrap.com/css/), which is included.  LESS files can be found in the CSS folders under the articles, core, and users directories - all of which are located in the public directory. (See Directory Structure section above to locate these).  In order for these files to be converted into CSS, and modify styling in the views, save LESS files within these CSS folders.



Sign Up/Sign In Feature
------------
The client-side files for user authentication, which are used in the [/signup] (https://github.com/carmenvkrol/bloc3/blob/master/public/modules/users/views/authentication/signup.client.view.html) and [/signin](https://github.com/carmenvkrol/bloc3/blob/master/public/modules/users/views/authentication/signin.client.view.html) views, are in the users directory within the public directory.  The server-side functionality is in the users files within the app folder.  (See Directory Structure section above to locate these).



Booksmarks and Tags Features
------------
The client-side functionality for bookmarks and tags, which are used in the [/tags](https://github.com/carmenvkrol/bloc3/blob/master/public/modules/articles/views/tags.client.view.html) and [/articles](https://github.com/carmenvkrol/bloc3/blob/master/public/modules/users/views/list-articles.client.view.html) views, can be found in the articles directory within the public directory. The server-side functionality is found in the articles files within the app folder. (See Directory Structure section above to locate these). 



Grunt Plugins
------------
A list of the plugins used by Grunt and what they're used for:

**[Grunt-Cli](https://github.com/gruntjs/grunt-cli)** - provides access to grunt via command line in terminal

**[Grunt-Concurrent](https://github.com/sindresorhus/grunt-concurrent)** - runs grunt tasks concurrently

**[Grunt-Contrib-CSSlint](https://github.com/gruntjs/grunt-contrib-csslint)** - lint CSS files

**[Grunt-Contrib-CSSmin](https://github.com/gruntjs/grunt-contrib-cssmin)** - minifies CSS files for production

**[Grunt-Contrib-JShint](https://github.com/gruntjs/grunt-contrib-jshint)** - detects potential errors and problems in the JavaScript code

**[Grunt-Contrib-Less](https://github.com/gruntjs/grunt-contrib-less)** - compiles LESS files into CSS.  See LESS section below for more details about styles in this application.

**[Grunt-Contrib-Uglify](https://github.com/gruntjs/grunt-contrib-uglify)** - compresses and minifies JavaScript files

**[Grunt-Contrib-Watch](https://github.com/gruntjs/grunt-contrib-watch)** - runs predefined tasks whenever watched files patterns are added, changed, or deleted

**[Grunt-Env](https://github.com/jsoverson/grunt-env)** - predefined Grunt tasks run for specified ENV configurations

**[Grunt-Karma](https://github.com/karma-runner/grunt-karma)** - for running Karma, a test runner for JavaScript.

**[Grunt-Mocha-Test](https://github.com/pghalliday/grunt-mocha-test)** - runs server-side mocha tests 

**[Grunt-Ngmin](https://github.com/btford/grunt-ngmin)** - pre-minifies Angular code

**[Grunt-Node-Inspector](https://www.npmjs.com/package/grunt-node-inspector)** - debugs Node.js

**[Grunt-Nodemon](https://github.com/ChrisWren/grunt-nodemon)** - monitors any changes in Node.js and automatically restarts the server

**[Grunt-Recess](https://github.com/sindresorhus/grunt-recess)** - lint and minify CSS and LESS using RECESS, which keeps style code clean and manageable

**[Load-Grunt-Tasks](https://github.com/sindresorhus/load-grunt-tasks)** - loads grunt tasks simulataneously instead of individually



Other Packages
------------
A list of other plugins used in this application and their purpose:

**[Async](https://github.com/caolan/async)** - provides functions for working with asynchronous JavaScript

**[Express](http://expressjs.com/)** - web framework for Node.js

**[Express-Session](https://github.com/expressjs/session)** - keeps track of users as they go through the app

**[Body-Parser](https://github.com/expressjs/body-parser)** - middleware that parses body data

**[Bower](http://bower.io/)** - package manager

**[Compression](https://github.com/expressjs/compression)** - middleware that compresses response data

**[Connect-Flash](https://github.com/jaredhanson/connect-flash)** - stores messages during sessions.  These messages are written to the flash and cleared after being displayed to the user.

**[Connect-Mongo](https://github.com/kcbanner/connect-mongo)** - stores relevant user data from MongoDB during session

**[Consolidate](https://github.com/tj/consolidate.js)** - template consolidation library

**[Cookie-Parser](https://github.com/expressjs/cookie-parser)** - parses cookie header and populates req.cookies with an object keyed by the cookie names

**[Forever](https://github.com/foreverjs/forever)** - ensures that script runs continuously

**[Glob](https://github.com/isaacs/node-glob)** - matches files that are called with an asterisk (*)

**[Helmet](https://github.com/helmetjs/helmet)** - helps secure app

**[Karma](https://github.com/karma-runner/karma)** - test runner for JavaScript

**[Karma-Chrome-Launcher](https://github.com/karma-runner/karma-chrome-launcher)** - launches JavaScript code in Chrome browser in order to test with Karma

**[Karma-Coverage](https://github.com/karma-runner/karma-coverage)** - generates code coverage for Karma

**[Karma-Firefox-Launcher](https://github.com/karma-runner/karma-firefox-launcher)** - launches JavaScript code in Firefox browser in order to test with Karma

**[Karma-Jasmine](https://github.com/karma-runner/karma-jasmine)** - adapter for [Jasmine testing framework](http://jasmine.github.io/) to be used with Karma

**[Karma-PhantomJS-Launcher](https://github.com/karma-runner/karma-phantomjs-launcher)** - launches JavaScript in [PhantomJS](http://phantomjs.org/), which is a headless WebKit scriptable with a JavaScript API

**[Lodash](https://lodash.com/)** - utility library for JavaScript.  Simplifies writing certain code, such as comparing values between multiple arrays.

**[Method-Override](https://github.com/expressjs/method-override)** - allows the use HTTP verbs, such as PUT and DELETE, in places where the client doesn't support it

**[Mongoose](http://mongoosejs.com/)** - MongoDB object modeling for Node.js

**[Morgan](https://github.com/expressjs/morgan)** - automates logging of requests

**[Nodemailer](https://github.com/andris9/Nodemailer)** - sends emails with Node.js

**[Passport](http://passportjs.org/)** - authenticates users based on the credentials they provide

**[Passport-Facebook](https://github.com/jaredhanson/passport-facebook)** - Passport authentication for Facebook users

**[Passport-Github](https://github.com/jaredhanson/passport-github)** - Passport authentication for Github users

**[Passport-Google-OAuth](https://github.com/jaredhanson/passport-google-oauth)** - Passport authentication for Google users

**[Passport-LinkedIn](https://github.com/jaredhanson/passport-linkedin)** - Passport authentication for LinkedIn users

**[Passport-Local](https://github.com/jaredhanson/passport-local)** - username and password authentication

**[Passport-Twitter](https://github.com/jaredhanson/passport-twitter)** - Passport authentication for Twitter users

**[Request](https://github.com/request/request)** - simplifies HTTP calls

**[Should](https://github.com/shouldjs/should.js)** - keeps test code clean and error messages helpful

**[Supertest](https://github.com/tj/supertest)** - simplifies HTML assertions

**[Swig](http://paularmstrong.github.io/swig/)** - compiles and renders JavaScript templates



Screenshots
------------
![](https://github.com/carmenvkrol/bloc3/blob/master/listy-screenshot-homepage.png)

![](https://github.com/carmenvkrol/bloc3/blob/master/listy-screenshot-bookmarkspage.png)

![](https://github.com/carmenvkrol/bloc3/blob/master/listy-screenshot-tagspage.png)


Notes
-----
App built as part of the [Bloc] (http://www.bloc.io) Front-End Developer program.





