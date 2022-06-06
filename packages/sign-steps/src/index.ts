'use strict';
import { ContractInteract } from '@widgets/contract-interact';
const { send } = ContractInteract;

interface ResultType {
  success: boolean;
  msg?: string;
  data?: any;
}

interface TriggerType {
  address: string;
  functionSelector: string;
  parameters?: [];
  options?: Object;
  callbacks?: () => {};
  tronweb?: {};
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

  public executeSignsSimple = async (params: Array<TriggerType>, { callbacks = () => {}} = {}) => {
    this.completeNumber = 0;
    try {
      for (let i = 0; i < params.length; i++) {
        const { address, functionSelector, parameters = [], options = {}, callbacks = () => {}, tronweb = {} } = params[i];
        const res = await send(address, functionSelector, { parameters, options, callbacks, tronweb });
        if (res?.transaction?.txID) {
          this.setStepNumber(++this.completeNumber);
          continue;
        } else {
          console.log('error: ', res);
        }
      }
      callbacks && callbacks();
      return this.successData({ completedAmount: this.completeNumber });
    } catch (error) {
      this.setStepNumber(this.completeNumber);
      return this.errorMessage(`error: Continuous execution error, currently executed to the ${this.completeNumber} step, error message: ${error}`);
    }
  }

  public executeSigns = async (params: Array<TriggerType>, { callbacks = () => {}} = {}) => {
    this.completeNumber = 0;
    try {
      for (let i = 0; i < params.length; i++) {
        const { address, functionSelector, parameters = [], options = {}, callbacks = () => {}, tronweb = {} } = params[i];
        const res = await send(address, functionSelector, { parameters, options, callbacks, tronweb });
        if (res?.transaction?.txID) {
          this.emit('signStepNumber', ++this.completeNumber);
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
}

export const SignSteps = new Signs();
