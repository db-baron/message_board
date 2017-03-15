// Make an app with the following routes/capabilities
// GET '/' Displays all of the mongooses.
// GET '/mongooses/:id' Displays information about one mongoose.
// GET '/mongooses/new' Displays a form for making a new mongoose.
// POST '/mongooses' Should be the action attribute for the form in the above route (GET '/mongooses/new').
// GET '/mongooses/edit/:id' Should show a form to edit an existing mongoose.
// POST '/mongooses/:id' Should be the action attribute for the form in the above route (GET '/mongooses/edit/:id').
// POST '/mongooses/destroy/:id' Should delete the mongoose from the database by ID.

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();

// Use native promises
mongoose.Promise = global.Promise;

// Use bodyParser to parse form data sent via HTTP Post
app.use(bodyParser.urlencoded({ extended: true }));
console.log( __dirname);
// Tell the server to use a static file folder to handle requests for static content.
app.use(express.static(path.join(__dirname, "./static")));
// Set the location where express will look for the ejs views
app.set('views', path.join(__dirname, './views'));
// Tell express that the templating engine is EJS
app.set('view engine', 'ejs');

// Connect Mongoose to MongoDB.
mongoose.connect('mongodb://localhost/owls_db');

// Make a schema, OwlSchema which we'll use to model Owls.
var OwlSchema = new mongoose.Schema({   // Note that OwlSchema is a JSON object.
    // Validate the new owl data
    name:  { type: String, required: true, minlength: 2},
    age: { type: Number, min: 1, max: 500 },
    type: { type: String, required: true, minlength: 2 }
});

// Store the schema as a model with the name 'Owl'. Also resets the OwlSchema
mongoose.model("Owl", OwlSchema);

// Retrieve the schema "Owl" from our Models and assigns it to the variable Owl
// Note: Mongoose automatically looks for the lower case, plural version of your model name, so an Owl Mongoose model looks for 'owls' in Mongo.
var Owl = mongoose.model("Owl");

//// Let's hardcode adding a new owl to the database for testing purposes
// var new_owl = new Owl();
// new_owl.name = "Owl Franken";
// new_owl.age = 12;
// new_owl.type = "Hoot";
// new_owl.save(function(err, results){
//     console.log(results);  // prints to console
// })

// Note: anything that gets sent through the url is accessed by req.params, not req.body
// For Updating documents, the route is:  /owls/<% person_.id %>



//// ROUTES SECTION ////
app.get('/', function(req, res) {
    console.log("Figs"*50, req.body);
    Owl.find({}, function(err, results) {
        // Retrieve an array of owls. This code will run when the DB is done trying to find/retrieve records that match {}
        res.render("index", {owl_data : results});
    });
});

app.get('/new', function(req, res){
    res.render('new');
});

// Retrieve an owl
app.get('/:id', function(req, res) {
    Owl.find({ _id: req.params.id }, function(err, response) {
        if (err) {
            console.log(err);
        }
        console.log("Weeeeeeeeiiiiiaaaaaahhhhhh")
        console.log(response[0]);
        res.render("owl", {owl_data : response[0]});
    });
})

// Create an owl
app.post('/create', function(req, res){
    // Create a new owl
    Owl.create(req.body, function(err, result){
        if (err) { console.log(err); }
        res.redirect('/')
    });
});

// Save an owl to the database via the post to /create
// When someone presses the add button on index.ejs, a post request should be sent to the '/new' route.
// app.post('/create', function(req, res) {  // So in the add route we should create the owl, add it to the database, then redirect to the root route (index view).
//     console.log("#"*50)
//     console.log("POST DATA", req.body);
//     // Using the 'Owl' object constructor, create a new owl with the name, age, and type corresponding to those from req.body
//     var new_owl = new Owl(req.body);
//     // Try to save the new owl to the database and run a callback function with an error (if any) from the operation.
//     new_owl.save(function(err) {
//         // If there is an error then console.log that there was a problem.
//         if(err) {
//             console.log('Something went wrong, could not add new_owl');
//         }
//         else { // else console.log that we did well and then redirect to the root route
//             console.log('Successfully added an owl!');
//             res.redirect('/'); // Because you shouldn't render on Post
//             }
//     })
// })

app.get('/:id/edit', function(req,res){
    Owl.find({ _id:req.params.id }, function(err, response) {
        if (err) {
            console.log(err);
        }
    res.render("edit", {owl_data : response[0] });
    });
});

// app.post('/:id', function(req, res) {
//     res.render("edit", {owls: owl_data});
// })

app.post('/:id/destroy', function(req, res) {
    Owl.remove({ _id: req.params.id }, function(err, response){
      if (err) {
          console.log(err);
      }
      res.redirect('/');
    });
});


// // We're going to have the file /routes/index.js handle all of our routing.
// var route = require('./routes/index.js')(app); // We're creating the function 'route' and passing it app in the same line

// Tell the express app to listen on port 8550
app.listen(8550, function() {
    console.log("listening on port 8550");
});
