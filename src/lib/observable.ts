export interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
}

export interface Observer<T> {
  update(subject: T): void;
}
