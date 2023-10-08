export class EcodeError extends Error {
  get ecode() {
    return this._ecode;
  }
  constructor(private _ecode: number) {
    super();
  }
}

export class WordleInvalidWordError extends EcodeError {
  static ecode = 1;
  constructor() {
    super(WordleInvalidWordError.ecode);
  }
}

export class WordleGameDesyncError extends EcodeError {
  static ecode = 2;
  constructor() {
    super(WordleGameDesyncError.ecode);
  }
}
