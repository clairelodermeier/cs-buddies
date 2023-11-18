/*
The purpose of this file ____
*/

// server setup
const express = require('express');
const app = express();
const port = 3000;

const parser = require('body-parser');
const cookieParser = require('cookie-parser');

// for profile pictures
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public_html'));
app.use(express.json({ limit: '10mb' })); 
app.use(parser.json());
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
//    listings: [String],
//    purchases: [String]
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

// mongoose model
var User = mongoose.model('User', userSchema );

// create a list of sessions
let sessions = {};
// regularly remove expired sessions.
setInterval(removeSessions, 2000);

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

function authenticate(req, res, next) {
    /*
    The purpose of this function is to authenticate a user's credentials using cookies. 
    Param: req, res (request and response objects), next (next server request to follow)
    */

    let c = req.cookies;

    if (c != undefined) {
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
        const imgObj = new img(imageUploadObject);
        // saving the object into the database
        imgObj.save();
        res.end(JSON.stringify(imgObj._id));

    }
    else { console.log('upload error') };
});

//GET request for rendering image
app.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;

    // find the image by its ID
    const imgDoc = await img.findById(imageId).exec();

    // set content type 
    res.set('Content-Type', imgDoc.contentType);

    // send image data buffer 
    res.send(imgDoc.file.data);

});

//GET request for creating a user
app.get('/create/:user/:pass/:DoB/:email', (req, res) => {
   let p1 = User.find({username: req.params.user}).exec();
    p1.then((results) => {
        if (results.length == 0) {
            let u = new User({
                username: req.params.user,
                password: req.params.pass,
                DoB: req.params.DoB,
                email: req.params.email
            });
            let p = u.save();
            p.then(() => {
                res.end('User created!');
            });
            p.catch((err) => {
                console.log(err); res.send('failed');
            })
        } else {
            res.end('Username already taken')
        }
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});