"use strict";
(function() {

  var num = 0;
  var myKey = config.API_KEY;
  // function getScores() {
    fetch("https://api-nba-v1.p.rapidapi.com/games/live/", {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    		"x-rapidapi-key": myKey
      }
    })
    .then(response => {
      createGames(response);
    })
    .catch(err => {
      alert(err);
    });
  // }

  function getScores(awayScore, homeScore, arena, id) {
      let scoreModule = document.createElement("DIV");
      scoreModule.id = "scoreModule" + num.toString();
      let score = document.createElement("SPAN");
      score.innerHTML = awayScore + " - " + homeScore;
      score.classList.add("score");
      getTime(id, num);
      scoreModule.appendChild(score);
      scoreModule.classList.add("scoreModule");
      return scoreModule;
  }

  function createGames(responseText) {
    if (responseText.status == 200) {
      responseText.json().then(function(result) {
        if (result.api.games.length > 0) {
          for (let i = 0; i < result.api.games.length; i++) {
            let game = document.createElement("div");
            game.id = "gameModule" + num.toString();
            $("nbaScores").appendChild(game);
            getLogo(result.api.games[i].vTeam.teamId, "left", num);
            getLogo(result.api.games[i].hTeam.teamId, "right", num);
            let score = getScores(result.api.games[i].vTeam.score.points, result.api.games[i].hTeam.score.points,
                                  result.api.games[i].arena, result.api.games[i].gameId);
            game.appendChild(score);
            game.classList.add("liveGame");
            increaseSize(50);
            num++;
          }
        } else {
          noLiveGames();
        }
      });
    } else {
      noLiveGames();
    }
  }

  function noLiveGames() {
    let score = document.createElement("span");
    score.innerHTML = "No Live Games";
    score.classList.add("noLiveGames");
    $("nbaScores").classList.add("noGamesBox");
    increaseSize(50);
    $("nbaScores").appendChild(score);
  }

  function getTime(gameId, numGame) {
    fetch("https://api-nba-v1.p.rapidapi.com/games/gameId/" + gameId, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
        "x-rapidapi-key": myKey
      }
    })
      .then(response => {
        displayTime(response, numGame);
      })
      .catch(err => {
        alert(err);
      });
    }

  function displayTime(responseText, numGame) {
    responseText.json().then(function(result) {
      let time = document.createElement("SPAN");
      let quarter = result.api.games[0].currentPeriod;
      quarter = quarter.charAt(0);
      time.innerHTML = "Q" + quarter + " - " + result.api.games[0].gameDuration;
      time.classList.add("time");
      let id = "scoreModule" + numGame.toString();
      $(id).appendChild(time);
    });
  }

  function getLogo(id, side, numGame) {
    fetch("https://api-nba-v1.p.rapidapi.com/teams/teamId/" + id, {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    		"x-rapidapi-key": myKey
      }
    })
    .then(response => {
      displayLogo(response, side, numGame);
    })
    .catch(err => {
    	alert(err);
    });
  }

  function $(id) {
    return document.getElementById(id);
  }

  function increaseSize(numPx) {
    document.body.style.height = document.getElementById("page-main").clientHeight + numPx + 'px';
  }

  function displayLogo(responseText, side, numGame) {
    responseText.json().then(function(result) {
      var team = document.createElement("DIV");
      var logo = document.createElement("IMG");
      var name = document.createElement("SPAN");
      logo.src = result.api.teams[0].logo;
      logo.classList.add("logo");
      team.appendChild(logo);
      if (side == "left") {
        team.classList.add("leftTeam");
      } else {
        team.classList.add("rightTeam");
      }
      name.innerHTML = result.api.teams[0].nickname;
      name.classList.add("teamName");
      team.appendChild(name);
      let id = "gameModule" + numGame.toString();
      $(id).append(team);
    });
  }

})();
