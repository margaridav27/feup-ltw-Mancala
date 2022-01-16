class GameHistory {
  static localGames = (localStorage.games) ? JSON.parse(localStorage.games) : [];
  static localScores = (localStorage.scores) ? JSON.parse(localStorage.scores) : [];

  // static localGames = [
  //     { players: ["Bibs","Maggy"], score: [7,25] },
  //     { players: ["Mati","Maggy"], score: [15,17] },
  //     { players: ["Bia","Didi"], score: [10,22] },
  //     { players: ["Falcamir","Joni"], score: [7,27] },
  //     { players: ["Mike","Edgar"], score: [3,29] },
  //     { players: ["Guida","Didi"], score: [15,17] },
  // ]

  static renderGameCell(cell) {
    let tr = document.createElement('tr');

    let p1 = document.createElement('td');
    p1.innerText = cell.players[0];
    tr.appendChild(p1);

    let s1 = document.createElement('td');
    s1.innerText = cell.score[0];
    tr.appendChild(s1);

    let sep = document.createElement('td');
    sep.innerText = '-';
    tr.appendChild(sep);

    let s2 = document.createElement('td');
    s2.innerText = cell.score[1];
    tr.appendChild(s2);

    let p2 = document.createElement('td');
    p2.innerText = cell.players[1];
    tr.appendChild(p2);

    return tr;
  }

  static renderScoreCell(cell) {
    let tr = document.createElement('tr');

    let p = document.createElement('td');
    p.innerText = cell.player;
    tr.appendChild(p);

    let l = document.createElement('td');
    l.innerText = cell.victories;
    tr.appendChild(l);

    let t = document.createElement('td');
    t.innerText = cell.totalGames;
    tr.appendChild(t);

    return tr;
  }

  static cleanHistory() {
    document.getElementById('games').innerHTML = '';
    document.getElementById('scores').innerHTML = '';
  }

  static updateLocalGames(game) {
    this.localGames.push({ players: game.players, score: game.score });
    localStorage.setItem("games", JSON.stringify(this.localGames));
  }

  static updateLocalScores(game) {

    for (let i = 0; i < 2; i++) {
      let scoreHistoryCell = this.localScores.find((info) => info.player == game.players[i]);

      if (scoreHistoryCell) {
        scoreHistoryCell.victories = (game.winner == game.players[i]) ? scoreHistoryCell.victories + 1 : scoreHistoryCell.victories;
        scoreHistoryCell.totalScore++;
      } else {
        scoreHistoryCell = {
          player: game.players[i],
          victories: (game.winner == game.players[i]) ? 1 : 0,
          totalGames: 1,
        };
        this.localScores.push(scoreHistoryCell);
      }
    }

    this.localScores.sort((p1, p2) => (p1.victories < p2.victories ? 1 : -1));
    localStorage.setItem("scores", JSON.stringify(this.localScores));
  }

  static renderLocalGames() {
    let table = document.getElementById('games');
    this.localGames.forEach((game) => {
      table.appendChild(this.renderGameCell(game));
    });
  }

  static renderLocalScores() {
    let table = document.getElementById('scores');
    this.localScores.forEach((score) => {
      table.appendChild(this.renderScoreCell(score));
    });
  }

  static addGameToHistory(game) {
    this.updateLocalScores(game);
    this.updateLocalGames(game);
  }
}
