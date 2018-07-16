const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require("express-session");
const createInitialSession = require("./middlewares/session.js");
const filter = require("./middlewares/filter.js");
require("dotenv").config();

const port = 1337;


const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) ); // I am not sure about this
app.use(session({
    secret: process.env.SECRET_VALUE, // provides the key for the session encryption
    resave: false, //choose wheter to save session regardless of if changes were made
    saveUninitialized: true, // choose wheter to save a session that is new, and hasnt been changed / added to yet
    cookie: {maxAge: 200000000 }// give the number of milliseconds until the session should expire
}));
app.use(createInitialSession);
app.use((req, res, next) => {
    let {method} = req;
    if (method === "POST" || method === "PUT") {
        filter(req, res, next);
    } else {
        next();
    }
})


app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );
app.get("/api/messages/history", mc.history);



app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );