class GameHistory {
    static games = [];

    static rettrieveHistory() {
        /* should we just return the array or render it here to document html? */
    }

    static addGameToHistory(game) {
        this.games.push(game);
    }
}