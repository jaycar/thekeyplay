var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");

app.use(express.static(__dirname));

app.use(express.bodyParser());

// Serve static files from public directory
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.sendfile("public/html/thekeyplay.html");
});

app.get("/tweets", function(req, res) {
    var obj = {};
    obj.users = userMap;
    obj.tweets = tweetList;

    res.send(JSON.stringify(obj));
    res.end();
});

app.post("/add_tweet", function(req, res) {
	var newTweet = req.body;

	// add tweets to list
	addTweet(newTweet);

	// send back tweets
    var obj = {};
    obj.users = userMap;
    obj.tweets = tweetList;
    res.send(JSON.stringify(obj));
    res.end();
});

http.listen(3000, function(){
    console.log("listening on *:3000");
});