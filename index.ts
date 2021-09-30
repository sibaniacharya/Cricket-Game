class Player {
    id: number;
    score: number;
    balls: number;
    ballScore: Array<number> = [null, null, null, null, null, null];

    constructor(id:number) {
        this.id = id;
        this.score = 0;
        this.balls = 0;
    }

    hit() {
        let run = Math.floor(Math.random() * 7);
        this.ballScore[this.balls] = run;
        this.score = this.score + run;
        this.balls++;
    }

}

class Team {
    id: number;
    players: Array<Player> = [];
    score: number;
    currentPlayer: Player;

    constructor(id:number) {
        this.id = id;

        for(let i=0; i<10; i++) {
            this.players.push(new Player(i));
        }

        this.currentPlayer = this.players[0];
        this.score = 0;
    }

    out()
    {
        this.currentPlayer = this.players[this.currentPlayer.id+1];
    }

    updateTable(runs:number, scoreupdate:number)
    {
        let t = this.id+1, p = this.currentPlayer.id+1, b = this.currentPlayer.balls;

        // last ball played into table
        let tag = ""+t+"p"+p+"b"+b;
        let lastrun = ""+runs;
        document.getElementById(tag).innerText = lastrun;

        // player total into table
        let playertot = ""+t+"p"+p+"tot";
        let newtot = ""+scoreupdate;
        document.getElementById(playertot).innerText = newtot;
    }

    teamHit()
    {
        this.currentPlayer.hit();
        let runs = this.currentPlayer.ballScore[this.currentPlayer.balls-1];
        this.score += runs;

        let playerScore = this.currentPlayer.score;
        this.updateTable(runs, playerScore);

        // man of the match
        if(playerScore > maxRuns)
        {
            maxRuns = playerScore;
            manOfTheMatch = "  PLAYER " + (this.currentPlayer.id+1) + "  from TEAM " + (this.id+1);
        }
        
        let updateScore = ""+this.score;
        if(this.id==0)
            document.getElementById("score1").innerText = updateScore;
        else
            document.getElementById("score2").innerText = updateScore;

        if(this.currentPlayer.balls==6 || runs==0)
        {
            if(this.currentPlayer.id < 9)
                this.out();
            else
                return true;
        }
        return false;
    }
}

class Game {
    teams: Array<Team> = [];
    currentTeam: Team;

    constructor() {
        this.teams.push(new Team(0));
        this.teams.push(new Team(1));

        this.currentTeam = this.teams[0];
    }

    nextTeam()
    {
        this.currentTeam = this.teams[this.currentTeam.id+1];
        document.getElementById("team1hit").disabled = true;
        document.getElementById("team2hit").disabled = false;

        changeTeam = true;
    }

    gameHit()
    {
        let allOut = this.currentTeam.teamHit();
        if(allOut)
        {
            if(this.currentTeam.id==0)
                this.nextTeam();
            else
                return true;
        }
        return false;
    }
}

let game = new Game();
// console.log(game);

let maxRuns = 0;
let manOfTheMatch;

let ended = false;
let changeTeam = false;

var timeleft = 59;
var hitTimer = setInterval(function(){
    if(ended)
        return;

    if(timeleft <= -1)
        clearInterval(hitTimer);
    
    if(timeleft>=0)
        document.getElementById("timer").innerText = (timeleft).toString();
    timeleft -= 1;

    if(timeleft===-1)
    {
        alert("Time Over!");
        
        if(game.currentTeam.id === 0)
        {
            game.nextTeam();
            timeleft = 60;
        }
        else
        {
            endGame();
            return ;
        }
    }
    
    if(changeTeam)
    {
        changeTeam = false;
        timeleft = 60;
    }

}, 1000);

function endGame()
{
    document.getElementById("team2hit").disabled = true;
    document.getElementById("generateResult").disabled = false;

    ended = true;
}

function hit() {
    let gameOver = game.gameHit();
    
    if(gameOver)
        endGame();

    // console.log(game.currentTeam);
}

function getResult()
{
    let score1 = parseInt(document.getElementById("score1").textContent);
    let score2 = parseInt(document.getElementById("score2").textContent);

    let result = "";
    
    if(score1 > score2)
        result = " TEAM1";
    else if(score1 < score2)
        result  = " TEAM2";
    else
        result = "Match Drawn";

    document.getElementById("result").innerText += result;
    document.getElementById("motm").innerText += manOfTheMatch;

    // disabling the generate result button
    document.getElementById("generateResult").disabled = true;
}