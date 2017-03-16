var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/message_board_db1');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({extended: false}));

// One post can have many comments
var PostSchema = new Schema({
    name: String,
    post: String,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}] // References the data in the Comment model
});

var CommentSchema = new Schema({
    name: String,
    comment: String,
    post: {type: Schema.Types.ObjectId, ref: "Post"}  // References the data in the Post model
});

mongoose.model('Post', PostSchema); // Create a model 'Post' and pass it a Schema
var Post = mongoose.model('Post');  // Call the Post model we just created and save it in the var Post

var Comment = mongoose.model("Comment", CommentSchema)// Like above but condensed into one line of code.


// Routes
app.get('/', function(req, res){
    // Populate comments (an attribute defined comment in PostSchema). It's a little weird because comments itself has info about what model it's coming from
    Post.find({}).populate('comments').exec(function(err, posts){
        console.log(posts);
        res.render('index', {posts : posts});
    })
    // Post.find({}, function(err, posts){    // Go to the database
    //     if(err){
    //         console.log(err);
    //         console.log("Something broke in app.get(/)")
    //     }
    //     res.render('index.ejs', {posts: posts});
    // })
});

app.post('/comments/:id', function(req, res){
    console.log("UMBRELLA");
    console.log("req.body is", req.body);
    console.log("req.params is", req.params);
    var comment_data = {name: req.body.name, comment: req.body.comment, post: req.params.id};
    var new_comment = new Comment(comment_data);
    Post.findOne({_id: req.params.id}, function(err, posts){
        console.log(posts);
        posts.comments.push(new_comment);
        posts.save(function(err, results){
            new_comment.save(function(err, comment_results){
                res.redirect('/');
            })
        })
    })
});

app.post('/posts', function(req, res){
    var new_post = new Post(req.body);  // This new Post will have a new MongoID that' you'll automatically have stored in  new_post
    console.log("^"*25, new_post);
    new_post.save(function(err, results){
        if (err){
            console.log(err);
            console.log("Something broke");
        }
        else{
            res.redirect('/');
        }
    })
})

app.listen(8600, function() {
    console.log("listening on port 8600");
});
