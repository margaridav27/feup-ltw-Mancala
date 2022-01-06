class Server {
  static url = 'http://twserver.alunos.dcc.fc.up.pt:8008';
  static game = undefined;
  static user = undefined;
  static pass = undefined;

  static async register(data) {
    this.user = data.nick;
    this.pass = data.pass;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        nick: this.user,
        password: this.pass,
      }),
    };

    await fetch(`${this.url}/register`, req)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  static async join(data) {
    const { size, seeds } = data;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        group: 78,
        nick: this.user,
        password: this.pass,
        size: parseInt(size),
        initial: parseInt(seeds),
      }),
    };

    await fetch(`${this.url}/join`, req)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.game = data.game;
      })
      .catch((err) => {
        console.log('join', err);
      });
  }

  static notify(move) {
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

  static async update() {
    const eventSource = new EventSource(
      `${this.url}/update?` +
        new URLSearchParams({
          nick: this.user,
          game: this.game,
        })
    );
    eventSource.onopen = (event) => {
      console.log('event source open', event);
    };
    eventSource.onmessage = (event) => {
      console.log('event source message', event);
      const data = JSON.parse(event.data);
      this.board = data.board;
      eventSource.close();
    };
    eventSource.onerror = (event) => {
      console.log('event source error', event);
      eventSource.close();
    };
  }

  static ranking() {
    const req = {
      method: 'POST',
      body: JSON.stringify({}),
    };

    fetch(`${this.url}/ranking`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  }

  static leave() {
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
