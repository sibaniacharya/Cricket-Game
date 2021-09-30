var Player = /** @class */ (function () {
    function Player(id) {
        this.ballScore = [null, null, null, null, null, null];
        this.id = id;
        this.score = 0;
        this.balls = 0;
    }
    Player.prototype.hit = function () {
        var run = Math.floor(Math.random() * 7);
        this.ballScore[this.balls] = run;
        this.score = this.score + run;
        this.balls++;
    };
    return Player;
}());
var Team = /** @class */ (function () {
    function Team(id) {
        this.players = [];
        this.id = id;
        for (var i = 0; i < 10; i++) {
            this.players.push(new Player(i));
        }
        this.currentPlayer = this.players[0];
        this.score = 0;
    }
    Team.prototype.out = function () {
        this.currentPlayer = this.players[this.currentPlayer.id + 1];
    };
    Team.prototype.updateTable = function (runs, scoreupdate) {
        var t = this.id + 1, p = this.currentPlayer.id + 1, b = this.currentPlayer.balls;
        // last ball played into table
        var tag = "" + t + "p" + p + "b" + b;
        var lastrun = "" + runs;
        document.getElementById(tag).innerText = lastrun;
        // player total into table
        var playertot = "" + t + "p" + p + "tot";
        var newtot = "" + scoreupdate;
        document.getElementById(playertot).innerText = newtot;
    };
    Team.prototype.teamHit = function () {
        this.currentPlayer.hit();
        var runs = this.currentPlayer.ballScore[this.currentPlayer.balls - 1];
        this.score += runs;
        var playerScore = this.currentPlayer.score;
        this.updateTable(runs, playerScore);
        // man of the match
        if (playerScore > maxRuns) {
            maxRuns = playerScore;
            manOfTheMatch = "  PLAYER " + (this.currentPlayer.id + 1) + "  from TEAM " + (this.id + 1);
        }
        var updateScore = "" + this.score;
        if (this.id == 0)
            document.getElementById("score1").innerText = updateScore;
        else
            document.getElementById("score2").innerText = updateScore;
        if (this.currentPlayer.balls == 6 || runs == 0) {
            if (this.currentPlayer.id < 9)
                this.out();
            else
                return true;
        }
        return false;
    };
    return Team;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.teams = [];
        this.teams.push(new Team(0));
        this.teams.push(new Team(1));
        this.currentTeam = this.teams[0];
    }
    Game.prototype.nextTeam = function () {
        this.currentTeam = this.teams[this.currentTeam.id + 1];
        document.getElementById("team1hit").disabled = true;
        document.getElementById("team2hit").disabled = false;
        changeTeam = true;
    };
    Game.prototype.gameHit = function () {
        var allOut = this.currentTeam.teamHit();
        if (allOut) {
            if (this.currentTeam.id == 0)
                this.nextTeam();
            else
                return true;
        }
        return false;
    };
    return Game;
}());
var game = new Game();
// console.log(game);
var maxRuns = 0;
var manOfTheMatch;
var ended = false;
var changeTeam = false;
var timeleft = 59;
var hitTimer = setInterval(function () {
    if (ended)
        return;
    if (timeleft <= -1)
        clearInterval(hitTimer);
    if (timeleft >= 0)
        document.getElementById("timer").innerText = (timeleft).toString();
    timeleft -= 1;
    if (timeleft === -1) {
        alert("Time Over!");
        if (game.currentTeam.id === 0) {
            game.nextTeam();
            timeleft = 60;
        }
        else {
            endGame();
            return;
        }
    }
    if (changeTeam) {
        changeTeam = false;
        timeleft = 60;
    }
}, 1000);
function endGame() {
    document.getElementById("team2hit").disabled = true;
    document.getElementById("generateResult").disabled = false;
    ended = true;
}
function hit() {
    var gameOver = game.gameHit();
    if (gameOver)
        endGame();
    // console.log(game.currentTeam);
}
function getResult() {
    var score1 = parseInt(document.getElementById("score1").textContent);
    var score2 = parseInt(document.getElementById("score2").textContent);
    var result = "";
    if (score1 > score2)
        result = " TEAM1";
    else if (score1 < score2)
        result = " TEAM2";
    else
        result = "Match Drawn";
    document.getElementById("result").innerText += result;
    document.getElementById("motm").innerText += manOfTheMatch;
    // disabling the generate result button
    document.getElementById("generateResult").disabled = true;
}
