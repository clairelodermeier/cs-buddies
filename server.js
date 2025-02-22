/*
Claire Lodermeier, Audrey Hall, Joyce Dam
The purpose of this file is to set up a server for an online application similar to discord or 
twitter, with channels for users to communicate via posts and events. Uses mongodb to store 
information about users, channels, posts, and events. Handles a variety of GET and POST requests 
for interacting with these data. Tracks cookies for authenticating login sessions. 
*/

// server setup
const express = require('express');
const app = express();
const port = 3000;

const cookieParser = require('cookie-parser');
const crypto = require('node:crypto');

// for profile pictures
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public_html'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// database setup
const mongoose = require('mongoose');
const mongoDBURL = 'mongodb+srv://claire:Tqnwquj0JCOxzNr6@cluster0.1nzpiqt.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBURL);
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error');
});
var Schema = mongoose.Schema;

// create mongoose schema for users
var userSchema = new Schema({
    username: String,
    hash: String,
    email: String,
    DoB: String,
    pic: String,
    salt: String,
    mode: String,
    color: String

});

// create mongoose schema for channels
var channelSchema = new Schema({
    name: String,
    posts: [String],
});

// create mongoose schema for posts
var postSchema = new Schema({
    content: String,
    author: String, // User ID
    time: Number
});

// create mongoose schema for images
const imgSchema = new Schema({
    fileName: {
        type: String,
        required: true,
    },
    file: {
        data: Buffer,
        contentType: String,
    }
});

// create mongoose schema for events
const eventSchema = new Schema({
    title: String,
    date: String,
    location: String,
    time: String,
});


// mongoose models
var User = mongoose.model('User', userSchema);
var Channel = mongoose.model('Channel', channelSchema);
var Post = mongoose.model('Post', postSchema);
var Img = mongoose.model('Img', imgSchema);
var Event = mongoose.model('Event', eventSchema);

// create a list of sessions
let sessions = {};

// regularly remove sessions 
setInterval(removeSessions, 2000);

// This function adds a user's session with session id and time to a list of sessions. 
// Param: username, a string denoting the user's username
// Returns: sid, number which is the user's session id
function addSession(username) {
    /*
    The purpose of this function is to add a session for a user logged in.
    Param: username (String for the user's username)
    Return: sid (Number for session id)
    */
    let sid = Math.floor(Math.random() * 1000000000);
    let now = Date.now();
    sessions[username] = { id: sid, time: now };
    return sid;
}

// This function removes expired sessions from the sessions object. 
function removeSessions() {
    let now = Date.now();
    let usernames = Object.keys(sessions);
    for (let i = 0; i < usernames.length; i++) {
        let last = sessions[usernames[i]].time;
        // 15 minutes
        if (last + (60 * 1000 * 15) < now) {
            delete sessions[usernames[i]];
        }
    }
}

// This function authenticates a user's credentials using cookies. 
// Param: req, res (request and response objects), next (next server request to follow)
function authenticate(req, res, next) {
    console.log('authenticating...');
    let c = req.cookies;

    if (c != undefined && c.login != undefined) {
        // if there is an active login cookie for current user
        if (sessions[c.login.username] != undefined &&
            sessions[c.login.username].id == c.login.sessionID) {
            // renew session
            console.log("valid session found. Renewing due to activity");
            sessions[c.login.username].time = Date.now();
            // continue to next server request
            next();
        }
        else {
            // otherwise, redirect to login screen
            console.log('Invalid login. Redirecting to login');
            res.end("INVALID")
        }
    }
    else {
        console.log('Login cookie undefined. Redirecting to login');
        res.end("INVALID");
    }
}

// authenticate before server requests
app.use('/get/*', authenticate);
app.use('/set/*', authenticate);
app.use('/delete/*', authenticate);
app.use('/add/*', authenticate);

// GET request, redirects to login screen from empty path
app.get('/', (req, res) => {
    res.redirect('/account/login.html');
});

/*-------------------- account requests --------------------- */

//POST request for creating a user
app.post('/create/', (req, res) => {
    let userObj = req.body;
    let p1 = User.find({ "username": userObj.n }).exec();
    p1.then((results) => {
        if (results.length == 0) {
            let newSalt = '' + Math.floor(Math.random() * 10000000000);
            let toHash = userObj.p + newSalt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');
            let u = new User({
                username: userObj.n,
                hash: result,
                DoB: userObj.d,
                email: userObj.e,
                pic: userObj.i,
                channels: [],
                salt: newSalt,
                mode: 'light',
                color: 'C1133E'
            });
            u.save();
            console.log("user " + u.username + " created!");
            res.end("SUCCESS");

        } else {
            res.end('Username already taken');
        }
    });
});

// POST request, user login
app.post('/login/', (req, res) => {

    let u = req.body;

    let p1 = User.find({ username: u.username }).exec();
    p1.then((results) => {
        if (results.length == 0) {
            res.end("Could not find account. Try again.");
        }
        else {
            // find user by matching username
            let currentUser = results[0];

            //concatenate password and saved salt
            let toHash = u.password + currentUser.salt;

            // generate hash
            let h = crypto.createHash('sha3-256');

            //hash password+salt
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');

            // check if hash matches saved hash
            if (result == currentUser.hash) {
                let sid = addSession(u.username);
                res.cookie("login", { username: u.username, sessionID: sid },
                    { maxAge: 60000 * 2 });
                res.end('SUCCESS');
            }
            else {
                res.end("Incorrect password.");
            }
        }
    });

});

// GET request, user logout
app.get('/logout/', (req, res) => {
    delete sessions[req.cookies.login.username];
    res.end("SUCCESS");
});

// GET request, delete user account
app.get('/delete/account/', async (req, res) => {

    // end session
    delete sessions[req.cookies.login.username];

    // delete userDoc
    let p = User.deleteOne({ "username": req.cookies.login.username }).exec()
    p.then(() => {
        res.end("SUCCESS");
    })
});

/*-------------------- profile requests --------------------- */

// POST request for image upload
app.post('/upload', upload.single('photo'), async (req, res) => {
    if (req.file) {
        let imageUploadObject = {
            file: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            fileName: req.file.originalname,
        };
        const imgObj = new Img(imageUploadObject);
        // saving the object into the database
        imgObj.save();
        res.end(JSON.stringify(imgObj._id));

    }
    else { console.log('upload error') };
});

// GET request for the user's profile pic image ID
app.get('/get/imageID/', (req, res) => {
    // find current user
    let p = User.findOne({ "username": req.cookies.login.username }).exec();
    p.then((userDoc) => {
        const imageId = userDoc.pic;
        res.end(imageId);
    });

});

// GET request to change the user's profile pic image ID
app.get('/set/pic/:newPic', (req, res) => {
    // find current user
    let p = User.findOne({ "username": req.cookies.login.username }).exec();
    p.then((userDoc) => {
        userDoc.pic = (req.params.newPic).substring(1, req.params.newPic.length - 1);
        userDoc.save();
        res.end("SUCCESS");
    });

});

// GET request to change the user's email
app.get('/set/email/:newEmail', (req, res) => {
    // find current user
    let p = User.findOne({ "username": req.cookies.login.username }).exec();
    p.then((userDoc) => {
        userDoc.email = req.params.newEmail;
        userDoc.save();
        res.end("SUCCESS");
    });

});

// POST request to change the user's password
app.post('/set/password/', async (req, res) => {
    let passObj = req.body;
    let u = await User.findOne({ "username": req.cookies.login.username }).exec();

    let newSalt = '' + Math.floor(Math.random() * 10000000000);
    let toHash = passObj.p + newSalt;
    let h = crypto.createHash('sha3-256');
    let data = h.update(toHash, 'utf-8');
    let result = data.digest('hex');

    u.salt = newSalt;
    let p = u.save();

    p.then(() => {
        u.hash = result;
        u.save();
    }).then(() => {
        res.end("SUCCESS");
    });
});

//GET request for rendering image
app.get('/get/profilePic/:id', async (req, res) => {
    const imageId = req.params.id;

    // find the image by its ID
    const imgDoc = await Img.findById(imageId).exec();

    // set content type 
    res.set('Content-Type', imgDoc.contentType);

    // send image data buffer 
    res.send(imgDoc.file.data);

});

/*-------------------- display requests --------------------- */

// GET request, mode selected for a user
app.get('/get/mode/', async (req, res) => {

    // find user document
    var userDoc = await User.findOne({ "username": req.cookies.login.username }).exec();

    // get mode selected for user
    const mode = userDoc.mode;
    res.end(mode);
});

// GET request, set mode for a user
app.get('/set/mode/:mode', async (req, res) => {
    console.log('Setting mode to ' + req.params.mode);

    // find user document
    var userDoc = await User.findOne({ "username": req.cookies.login.username }).exec();

    // set mode selected for user
    if (req.params.mode == 'light') {
        userDoc.mode = "light";
    }
    else {
        userDoc.mode = "dark";
    }
    userDoc.save();
    res.end("SUCCESS");
});

// GET request, set color for a user
app.get('/set/color/:color', async (req, res) => {

    // find user document
    var userDoc = await User.findOne({ "username": req.cookies.login.username }).exec();

    // set color
    userDoc.color = req.params.color;
    userDoc.save();

    res.end("SUCCESS");
});

// GET request, color selected for a user
app.get('/get/color/', (req, res) => {

    // find user document
    let p = User.findOne({ "username": req.cookies.login.username }).exec();
    p.then((userDoc) => {
        // send color for user
        res.end(userDoc.color);
    });

});

/*-------------------- post and channel requests --------------------- */

// GET request, get all channel names
app.get('/channels/', async (req, res) => {

    // get all channels
    var channels = await Channel.find({}).exec();
    var channelNames = [];

    // create an array of channel Names
    for (let i = 0; i < channels.length; i++) {
        channelNames.push(channels[i].name);
    }
    res.end(JSON.stringify(channelNames));
});

// GET request, posts  for a given channel
app.get('/posts/:channelName', async (req, res) => {

    // find user document
    var channelDoc = await Channel.findOne({ name: req.params.channelName }).exec();

    var channelPosts = [];
    // create an array of posts docs that correspond to post ids
    for (let i = 0; i < channelDoc.posts.length; i++) {
        let currentPost = await Post.findById(channelDoc.posts[i]).exec();
        channelPosts.push(currentPost);
    }
    res.end(JSON.stringify(channelPosts));
});


//GET request, creates a channel doc
app.get('/add/channel/:channelName', function (req, res) {
    const thisChannel = new Channel({ name: req.params.channelName, posts: [] });
    thisChannel.save();
});

// GET request, creates a post doc and adds it to the channel's list
app.get('/add/post/:content/:channelName', function (req, res) {
    const thisPost = new Post({ content: req.params.content, author: req.cookies.login.username, time: Date.now() });
    thisPost.save();

    let thisChannel = Channel.findOne({ name: req.params.channelName }).exec();
    thisChannel.then((channelDoc) => {
        channelDoc.posts.push(thisPost.id);
        channelDoc.save();
    }).then(() => {
        res.end("SUCCESS");
    })
});

/*-------------------- calendar event requests --------------------- */

// POST request, create event
app.post('/add/event/', (req, res) => {

    let info = req.body;
    let thisEvent = new Event({
        title: info.title, date: info.date, location: info.loc,
        time: info.time
    });
    thisEvent.save();
    res.end("SUCCESS");

});

//GET requests, sends a list of all event objects
app.get('/events/', (req, res) => {
    let p = Event.find({}).exec();
    p.then((events) => {
        res.end(JSON.stringify(events));
    });
});


// Server start
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
