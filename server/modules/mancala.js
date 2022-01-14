let boardSize = 0;
let board = [];
let players = [];
let turn = 0;

const sideById = (id) => {
  return id >= 0 && id <= boardSize ? 0 : 1;
};

const nextPit = (id) => {
  return (id + 1) % (boardSize * 2 + 2);
};

const oppositePit = (id) => {
  return (boardSize * 2 - i) % (boardSize * 2 + 1);
};

const destinationWarehouse = (id) => {
  return sideById(id) === 0 ? 0 : boardSize * 2 + 1;
};

const isWarehouse = (id) => {
  return id === 0 || id === boardSize * 2 + 1;
};

const totallyEmptySide = (side) => {
  if (side === 0) {
    for (let i = 0; i < boardSize; i++) {
      if (board[i] !== 0) return false;
    }
  } else {
    for (let i = boardSize + 1; i < boardSize * 2 + 1; i++) {
      if (board[i] !== 0) return false;
    }
  }
  return true;
};

const side = (side) => {
  return side === 0 ? board.slice(0, boardSize) : board.slice(boardSize + 1, board.length - 1);
};

const seedsInWarehouse = (side) => {
  return side === 0 ? board[0] : board[board.length - 1];
};

module.exports.initGame = (size, initial, p1, p2) => {
  let side0 = array.fill(initial, 0, size - 1);
  side0.push(0); // left (side 0) warehouse
  let side1 = array.fill(initial, 0, size - 1);
  side1.push(0); // right (side 1) warehouse

  boardSize = size;
  initialSeeds = initial;
  board = [...side0, ...side1];
  players = [p1, p2];

  let response = {};
  if (winner) response.winner = winner;
  else if (match) response.winner = '';
  else response.board.turn = players[turn];
  response.board.sides[`${players[0]}`] = { store: 0, pits: side(0) };
  response.board.sides[`${players[1]}`] = { store: 0, pits: side(1) };
  return response;
};

module.exports.isPlayerTurn = (playerName) => {
  return players[turn] === playerName;
};

module.exports.performMove = (move, player) => {
  if (players[turn] !== player) return { error: 'Not your turn to play.' };
  if (sideById(move) !== turn || board[move] === 0) return { error: 'Invalid move.' };

  const seeds = board[move];
  board[move] = 0;

  let wasEmpty = false;
  let prev = move;

  // sow
  for (const seed of seeds) {
    wasEmpty = false;
    let next = nextPit(prev);
    if (isWarehouse(next) && sideById(move) !== turn) {
      const nextDup = nextPit(next);
      next = nextDup;
    }
    if (!isWarehouse(next)) wasEmpty = board[next] === 0;
    board[next] += 1;
    prev = next;
  }

  // capture
  if (wasEmpty && !isWarehouse(prev) && sideById(prev) === trun) {
    let capture = board[prev];
    board[prev] = 0;
    capture += board[oppositePit(prev)];
    board[oppositePit(prev)] = 0;
    board[destinationWarehouse(prev)] += capture;
  }

  // if did not play last on his own warehouse
  if (!(isWarehouse(prev) && sideById(prev) === turn)) {
    const turnDup = turn === 0 ? 1 : 0;
    turn = turnDup;
  }

  // cleaning
  let winner;
  let match = false;
  if (totallyEmptySide(0) || totallyEmptySide(1)) {
    for (const pit of board) {
      if (isWarehouse(pit)) continue;
      board[destinationWarehouse(pit)] += board[pit];
      board[pit] = 0;
    }

    if (board[0] > board[boardSize * 2 + 1]) winner = players[0];
    else if (board[0] < board[boardSize * 2 + 1]) winner = players[1];
    else match = true;
  }

  let response = {};
  if (winner) response.winner = winner;
  else if (match) response.winner = '';
  else response.board.turn = players[turn];
  response.board.sides[`${players[0]}`] = { store: seedsInWarehouse(0), pits: side(0) };
  response.board.sides[`${players[1]}`] = { store: seedsInWarehouse(1), pits: side(1) };
  response.board.turn = turn;
  return response;
};
