/*
The purpose of this file ____
*/

const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;

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



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});