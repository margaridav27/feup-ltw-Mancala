class Server {
  constructor() {
    this.url = 'http://twserver.alunos.dcc.fc.up.pt:8008';
    this.game = undefined;
    this.user = undefined;
    this.pass = undefined;
  }

  register(data) {
    this.user = data.nick;
    this.pass = data.pass;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        nick: this.user,
        password: this.pass,
      }),
    };

    fetch(`${this.url}/register`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  }

  join(data) {
    const { size, seeds } = data;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        group: 77, // a alterar
        nick: this.user,
        password: this.pass,
        size: parseInt(size),
        initial: parseInt(seeds),
      }),
    };

    fetch(`${this.url}/join`, req)
      .then((res) => res.json())
      .then((parsedRes) => (this.game = parsedRes.game))
      .catch((err) => console.log('join', err));

    console.log('join: game', this.game);
  }

  notify(move) {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        game: this.game,
        nick: this.user,
        password: this.pass,
        move,
      }),
    };

    fetch(`${this.url}/notify`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  }

  update() {
    const req = {
      method: 'GET',
    };

    fetch(
      `${this.url}/update?` +
        new URLSearchParams({
          nick: this.user,
          game: this.game,
        }),
      req
    )
      .then((res) => res.json())
      .then((data) => {
        this.board = data.board;
        return 1;
      })
      .catch((err) => console.log(err));
    return 0;
  }

  ranking() {
    const req = {
      method: 'POST',
      body: JSON.stringify({}),
    };

    fetch(`${this.url}/ranking`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  }

  leave() {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        game: this.game,
        nick: this.user,
        password: this.pass,
      }),
    };

    fetch(`${this.url}/leave`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log('leave', err));
  }
}

/*
{
  "sides" : {
  "zp"     : {
      "store": 0,
      "pits": [ 4, 4, 4, 4, 4, 4 ]
      }
  "jpleal" : {
      "store": 0,
      "pits": [ 4, 4, 4, 4, 4, 4 ]
      }
  },
  "turn": "zp"
}
*/
