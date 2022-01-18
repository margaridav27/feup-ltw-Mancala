class Server {
  constructor() {
    //this.url = 'http://twserver.alunos.dcc.fc.up.pt:8000';
    this.url = 'http://localhost:9080';
    this.game = undefined;
    this.group = '78';
    this.user = undefined;
    this.pass = undefined;
    this.eventSource = undefined;
  }

  getUser() {
    return this.user;
  }

  closeEventSource() {
    this.eventSource.close();

  }

  async register(data) {
    this.user = data.nick;
    this.pass = data.pass;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        nick: this.user,
        password: this.pass,
      }),
    };

    let response = {};
    await fetch(`${this.url}/register`, req)
      .then((res) => res.json())
      .then((data) => (response = data))
      .catch((err) => response.error = err)

    return response;
  }

  async join(data) {
    const { size, seeds } = data;

    const req = {
      method: 'POST',
      body: JSON.stringify({
        group: this.group,
        nick: this.user,
        password: this.pass,
        size: size.toString(),
        initial: seeds.toString(),
      }),
    };

    await fetch(`${this.url}/join`, req)
      .then((res) => res.json())
      .then((data) => (this.game = data.game))
      .catch((err) => console.log('join', err));
  }

  async notify(move) {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        game: this.game,
        nick: this.user,
        password: this.pass,
        move,
      }),
    };

    let response = '';
    await fetch(`${this.url}/notify`, req)
      .then((res) => res.json())
      .then((data) => (response = data))
      .catch((err) => console.log('notify', err));

    return response;
  }

  async update(callback) {
    if (!this.eventSource) {
      this.eventSource = new EventSource(
        `${this.url}/update?` +
          new URLSearchParams({
            nick: this.user,
            game: this.game,
          })
      );

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  }

  async ranking(winner) {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        nick: this.user,
        winner: winner,
      }),
    };
    console.log(req);
    await fetch(`${this.url}/ranking`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  }

  async leave() {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        game: this.game,
        nick: this.user,
        password: this.pass,
      }),
    };

    let response = '';
    await fetch(`${this.url}/leave`, req)
      .then((res) => res.json())
      .then((data) => (response = data))
      .catch((err) => console.log('leave', err));
    console.log(response);
    return response;
  }
}
