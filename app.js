// require the modules we need
// STOP: what are these modules? Use online documentation to read up on them.
var express = require('express');
var path = require('path');
var fs = require('fs');
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require('body-parser');

var app = express();

// this sets a static directory for the views
app.use(express.static(path.join(__dirname, 'static')));

// using the body parser module
app.use(bodyParser.urlencoded({ extended: false }));

app.use(ejsLayouts);
app.set('view engine', 'ejs');

// your routes here

// redirect get of the root URL to the /games route
app.get('/', function(req, res) {
    res.redirect('/games');
});

// display a list of all games, action: index
app.get('/games', function(req, res) {
    // get all the games
    var games = getGames();
    // console.log(games[0]);
    res.render('games-index', { games: games });
});

// return an HTML form for creating a new game
app.get('/games/new', function(req, res) {
    res.render('games-new');

});
// create a new game (using form data from /games/new)
// does not need its own page, only adds game to array
app.post('/games', function(req, res) {
    console.log(req.body);
    var newGame = req.body;

    var games = getGames();
    games.push(newGame);
    saveGames(games);

    res.redirect('/games');
});

// show or display a specific game
app.get('/games/:name', function(req, res) {
    // set variable = the name parameter
    var nameOfTheGame = req.params.name;
    // console.log(nameOfTheGame);
    var games = getGames();
    var game = getGame(games, nameOfTheGame);

    res.render('games-show', game);
});

// return an HTML form for editing a game
app.get('/games/:name/edit', function(req, res) {
    var nameOfTheGame = req.params.name;
    var games = getGames();
    var game = getGame(games, nameOfTheGame);

    res.render('games-edit', game);
});

// update a specific game (using form data from /games/:name/edit)
app.put('/games/:name', function(req, res) {
    var theNewGameData = req.body;

    var nameOfTheGame = req.params.name;
    var games = getGames();
    var game = getGame(games, nameOfTheGame);

    game.name = theNewGameData.name;
    game.description = theNewGameData.description;

    saveGames(games);

    res.send(req.body);
});

// deletes a specific game
app.delete('/games/:name', function(req, res) {
    var nameOfTheGame = req.params.name;
    var games = getGames();
    var game = getGame(games, nameOfTheGame);
    var indexOfGameToDelete = games.indexOf(game);

    games.splice(indexOfGameToDelete, 1);

    saveGames(games);

    res.send(game);
});

// helper functions

// This is my function: get a specific game
function getGame(games, nameOfTheGame) {
    var game = null;

    for (var i = 0; i < games.length; i++) {
        if (games[i].name.toLowerCase() == nameOfTheGame.toLowerCase()) {
            game = games[i];
            break;
        }
    }
    return game;
}

// Read list of games from file.
function getGames() {
    var fileContents = fs.readFileSync('./games.json'); // :'(
    var games = JSON.parse(fileContents);
    return games;
}

// Write list of games to file.
function saveGames(games) {
    fs.writeFileSync('./games.json', JSON.stringify(games));
}

// start the server

var port = 3000;
console.log("http://localhost:" + port);
app.listen(port);
