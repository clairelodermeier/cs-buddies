/*
The purpose of this file ____
*/

// server setup
const express = require('express');
const app = express();
const port = 3000;

const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const crypto = require('node:crypto');

// for profile pictures
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public_html'));
app.use(express.json({ limit: '10mb' })); 

app.use(cookieParser());


// database setup
const mongoose = require('mongoose');
const { ConnectionClosedEvent } = require('mongodb');
const mongoDBURL = 'mongodb+srv://claire:Tqnwquj0JCOxzNr6@cluster0.1nzpiqt.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error');
});
var Schema = mongoose.Schema;

// create mongoose schema for users
var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    DoB: String,
    pic: String,
    channels: [String],
    salt: String,
    hash: String

});

// create mongoose schema for channels
var channelSchema = new Schema({
    name: String,
    posts: [String],
    members: [String],
    // more fields??

});

// create mongoose schema for posts
var postSchema = new Schema({
    content: String,
    author: String, // User ID
    // timestamp??
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

// mongoose models
var User = mongoose.model('User', userSchema );
var Channel = mongoose.model('Channel', channelSchema );
var Post = mongoose.model('Post', postSchema );
var Img = mongoose.model('Img', imgSchema );


// create a list of sessions
let sessions = {};


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

function removeSessions() {
    /*
    The purpose of this function is to remove expired sessions from the sessions object. 
    */
    let now = Date.now();
    let usernames = Object.keys(sessions);
    for (let i = 0; i < usernames.length; i++) {
        let last = sessions[usernames[i]].time;
        // 15 minutes
        if (last + 60000 * 15 < now) {
            delete sessions[usernames[i]];
        }
    }
}

setInterval(removeSessions, 2000); //Log out after 20 min

function authenticate(req, res, next) {
    /*
    The purpose of this function is to authenticate a user's credentials using cookies. 
    Param: req, res (request and response objects), next (next server request to follow)
    */

    let c = req.cookies;


    if (c != undefined && c.login != undefined) {
        // if there is an active login cookie for current user
        if (sessions[c.login.username] != undefined &&
            sessions[c.login.username].id == c.login.sessionID) {
            // renew session
            sessions[c.login.username].time = Date.now();
            // continue to next server request
            next();
        }
        else {
            // otherwise, redirect to login screen
            res.redirect('/login.html');
        }
    }
    else {
        res.redirect('/login.html');
    }

}

//app.use('/*', authenticate);
// app.get('/*', (req, res, next) => { 

//   next();
// });

//Purely for testing
app.get('/A', (req, res, next) => {
    console.log('A');
    next();
  });
  
  app.get('/A', (req, res, next) => {
    console.log('B');
    next();
  });
  
  app.get('/A', (req, res, next) => {
    console.log('C');
    res.end('Made it to C!');
  });
  

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


//GET request for rendering image
app.get('/profilePic/:id', async (req, res) => {
    const imageId = req.params.id;

    // find the image by its ID
    const imgDoc = await img.findById(imageId).exec();

    // set content type 
    res.set('Content-Type', imgDoc.contentType);

    // send image data buffer 
    res.send(imgDoc.file.data);

});

//POST request for creating a user
app.post('/account/create/', (req, res) => {
    let userObj = req.body;
    console.log("creating user " + userObj.n);
    let p1 = User.find({username: userObj.n}).exec();
    p1.then((results) => {
        if (results.length == 0) {
            let newSalt = '' + Math.floor(Math.random() * 10000000000);
            let toHash = userObj.p + newSalt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');

            let u = new User({
                username: userObj.n,
                // TODO: salt and hash password
                password: result,
                DoB: userObj.d,
                email: userObj.e,
                pic: userObj.i,
                channels: [],
                salt: newSalt,
            });

            u.save();
            res.end("SUCCESS");
        } else {
            res.end('Username already taken');
        }
    });
});


// POST request, user login
app.post('/account/login/',  (req, res) => {
    //find user by matching username
    //concatenate password and saved salt
    //hash password+salt
    //check if hash matches saved hash

    let u = req.body;
    let p1 = User.find({username: u.username, password: u.password}).exec();
    p1.then((results) =>
    {
        if(results.length == 0)
        {
            res.end("Could not find account. Try again.");
        }
        else
        {
            let currentUser = results[0];
            let toHash = u.password = currentUser.salt;
            let h = crypto.createHash('sha3-256');
            let data = h.update(toHash, 'utf-8');
            let result = data.digest('hex');

            if(result == currentUser.hash)
            {
                let sid = addSession(u.username);
                res.cookie("login", {username: u.username, sessionID: sid},
                {maxAge: 60000 * 2 });
                res.end('SUCCESS');
            }
            else
            {
                res.end("FAILED TO LOG IN");
            }
        }
    });

});

// GET request, channels for a given user
app.get('/get/channels/', async (req, res) => {
    // find user document
    var userDoc = await User.findOne({ "username": req.cookies.login.username }).exec();

    // get channel ids for user
    const channels = userDoc.channels;

    // create an array of channels that correspond to channel ids
    const userChannels = [];
    for (let i = 0; i < channels.length; i++) {
        const currentChannel = await Channel.findById(channels[i]).exec();
        userChannels.push(currentChannel);
    }
    res.end(JSON.stringify(userChannels));
});

// GET request, posts for a given channel
app.get('/get/posts/:channel', async (req, res) => {
    // find user document
    var userDoc = await User.findOne({ "username": req.cookies.login.username }).exec();
   
    // TODO: find a channel in user's channels with name given by req.params.channel
    // get list of that channel's posts

    // create an array of posts that correspond to post ids
    const channelPosts = [];
    for (let i = 0; i < posts.length; i++) {
        const currentPost = await Post.findById(posts[i]).exec();
        channelPosts.push(currentPost);
    }
    res.end(JSON.stringify(channelPosts));
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
