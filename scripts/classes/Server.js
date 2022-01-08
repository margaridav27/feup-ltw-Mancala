class Server {
  constructor() {
    this.url = 'http://twserver.alunos.dcc.fc.up.pt:8008';
    this.game = undefined;
    this.user = undefined;
    this.pass = undefined;
    this.eventSource = undefined;
    this.eventSourceHandler = undefined;
  }

  setEventSourceHandler(handler) {
    this.eventSourceHandler = handler;
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

    await fetch(`${this.url}/register`, req)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  async join(data) {
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

    await fetch(`${this.url}/notify`, req)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log('notify', err);
      });
  }

  async update() {
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
        return this.eventSourceHandler(data);
      };
    }
  }

  async ranking() {
    const req = {
      method: 'POST',
      body: JSON.stringify({}),
    };

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

    await fetch(`${this.url}/leave`, req)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log('leave', err));
  }
}
