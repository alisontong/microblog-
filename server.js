// SERVER-SIDE JAVASCRIPT
// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require("underscore"),
    session = require('express-session'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/test");
var User = require('./models/user');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'OurSuperSecretCookieSecret',
  cookie: { maxAge: 60000 }
}));



// Posts

// pre-seeded post data
var posts =[
  {id: 1, author: "Alan", text: "Hiked 8 miles this weekend! Finally made it out to the waterfall."},
  {id: 3, author: "Celeste", text: "On the other side of the cloud, a silver lining."},
  {id: 2, author: "Bette", text: "Garden starting to produce veggies! Best tomato ever."},
  {id: 4, author: "Daniel", text: "Been relearning geometry to help niece -- owning triangles so hard right now."},
  {id: 5, author: "Evelyn", text: "We need team jackets!"},
];
var totalPostCount = 9;




// ROUTES

// Static file route(s)


// root route (serves index.html)
app.get('/login', function (req, res) {
  var html = '<form action="/api/sessions" method="post">' +
               'Your email: <input type="text" name="email"><br>' +
               'Your password: <input type="text" name="password"><br>' +
               '<button type="submit">Submit</button>' +
               '</form>';
  if (req.session.user) {
    html += '<br>Your email from your session is: ' + req.session.user.email;
  }
  console.log(req.session);
  res.send(html);
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});


// Data/API routes

// get all posts
app.get('/api/posts', function (req, res) {
  // send all posts as JSON response
  res.json(posts);
});

// create new post
app.post('/api/sessions', function (req, res) {
  console.log(req);-
  User.authenticate(req.body.email, req.body.password, function(error, user) {
    req.session.user = user;
    res.redirect('/login');
  });
});

app.post('/api/posts', function (req, res) {
  // grab params (author and text) from form data
  var newPost = {}
  newPost.text = req.body.text;
  newPost.author = req.body.author;
  
  // set a unique id never used by a post until now
  totalPostCount++;
  newPost.id = totalPostCount;

  // add newPost to `posts` array
  posts.push(newPost);
  
  // send newPost as JSON response
  res.json(newPost);
});

// get a single post 
app.get('/api/posts/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = parseInt(req.params.id);

  // find item in `posts` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // send back post object
  res.json(foundPost);
});

// update single post
app.put('/api/posts/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = parseInt(req.params.id);

  // find item in `posts` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // update the post's author
  foundPost.author = req.body.author;

  // update the post's text
  foundPost.text = req.body.text;

  // send back edited object
  res.json(foundPost);
});

// delete post
app.delete('/api/posts/:id', function(req, res) {
  
  // take the value of the id from the url parameter
  var targetId = parseInt(req.params.id);

  // find item in `posts` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // get the index of the found item
  var index = posts.indexOf(foundPost);
  
  // remove the item at that index, only remove 1 item
  posts.splice(index, 1);
  
  // send back deleted object
  res.json(foundPost);
});

// set server to localhost:3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});