import { defineStore } from "pinia";

class Counter {
  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  increment() {
    this._value++;
  }
}

export const useCounterStore = defineStore("counter", {
  state: () => ({ _counter: new Counter() }),
  getters: {
    counter: (state) => state._counter.value,
    doubleCount: (state) => state._counter.value * 2,
  },
  actions: {
    increment() {
      this._counter.increment();
    },
  },
});
