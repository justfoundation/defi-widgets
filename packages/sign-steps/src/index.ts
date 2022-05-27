'use strict';

interface ResultType {
  success: boolean;
  msg?: string;
  data?: any;
}

export class Signs {
  public stepNumber: number = 0;
  public completeNumber: number = 0;
  private _events: any;

  constructor() {
    this._events = {};
  }

  on(event: string | number,callback: any) {
    let callbacks = this._events[event] || [];
    callbacks.push(callback);
    this._events[event] = callbacks;
    return this;
  }
  off(event: string | number,callback: any) {
    let callbacks = this._events[event];
    this._events[event] = callbacks && callbacks.filter((fn: any) => fn !== callback);
    return this;
  }
  emit(event: string | number, ...args: any[]) {
    const callbacks = this._events[event];
    callbacks.forEach((fn: { apply: (arg0: null, arg1: any[]) => any; }) => fn.apply(null,args));
    return this;
  }

  private errorMessage = (msg: string) => {
    const error: ResultType = { success: false, msg };
    return error;
  };

  private successData = (data?: any) => {
    const result: ResultType = { success: true, data };
    return result;
  };

  public getStepNumber = () => {
    return this.stepNumber;
  };

  private setStepNumber = (stepNumber: number) => {
    this.stepNumber = stepNumber;
  }

  public executeSignsSimple = async (functions: Array<Function>, { callbacks = () => {}} = {}) => {
    this.completeNumber = 0;
    try {
      for (let i = 0; i < functions.length; i++) {
        const res = await functions[i]();
        if (res || res == undefined) {
          this.setStepNumber(++this.completeNumber);
          continue;
        }
      }
      callbacks && callbacks();
      return this.successData({ completedAmount: this.completeNumber });
    } catch (error) {
      this.setStepNumber(this.completeNumber);
      return this.errorMessage(`error: Continuous execution error, currently executed to the ${this.completeNumber} step, error message: ${error}`);
    }
  }

  public executeSigns = async (functions: Array<Function>, { callbacks = () => {}} = {}) => {
    this.completeNumber = 0;
    try {
      functions.map(async (func) => {
        await func();
        this.emit('signStepNumber', ++this.completeNumber);
        this.setStepNumber(++this.completeNumber);
      })
      callbacks && callbacks();
      return this.successData({ completedAmount: this.completeNumber });
    } catch (error) {
      this.setStepNumber(this.completeNumber);
      return this.errorMessage(`error: Continuous execution error, currently executed to the ${this.completeNumber} step, error message: ${error}`);
    }
  }
}

export const SignSteps = new Signs();
