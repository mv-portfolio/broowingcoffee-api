class Cache {
  #tokensUsed;

  constructor() {
    this.#tokensUsed = [];
  }

  peekUsedTokens() {
    return this.#tokensUsed;
  }
  pushUsedToken(token) {
    this.#tokensUsed.push(token);
  }
  popUsedToken(token) {
    this.#tokensUsed = this.#tokensUsed.filter(
      tokenUsed => tokenUsed !== token,
    );
  }
  popAllUsedTokens() {
    this.#tokensUsed = [];
  }
  isTokenUsed(token) {
    let isUsed = false;
    this.#tokensUsed.forEach(tokenUsed => {
      if (tokenUsed === token) isUsed = true;
    });
    return isUsed;
  }
}

module.exports = Cache;
