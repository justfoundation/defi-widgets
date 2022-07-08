'use strict';
import { ContractInteract } from '@widgets/contract-interact';
const { send } = ContractInteract;

interface TriggerType {
  address: string;
  functionSelector: string;
  parameters?: [];
  options?: Object;
  callbacks?: () => {};
  tronweb?: {};
}

export class Signs {
  private stepNumber: number = 0;
  private completeNumber: number = 0;
  private stepParams: Array<TriggerType> = [];
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
    this._events[event] = callbacks && callbacks.filter((fn: any) => {
      return fn !== callback
    });
    return this;
  }
  emit(event: string | number, ...args: any[]) {
    const callbacks = this._events[event];
    callbacks.forEach((fn: { apply: (arg0: null, arg1: any[]) => any; }) => fn.apply(null,args));
    return this;
  }

  public getStepNumber = () => {
    return this.stepNumber;
  };

  public executeContinuousSigns = async (params: Array<TriggerType>) => {
    this.completeNumber = 0;
    this.stepNumber = 0;
    this.stepParams = params;

    this.continueCurrentSignSteps();
  }

  public continueCurrentSignSteps = async () => {
    try {
      for (let i = this.stepNumber; i < this.stepParams.length; i++) {
        this.stepNumber = i;
        this.emit('startAtStep', i+1);

        const { address, functionSelector, parameters = [], options = {}, callbacks = () => {}, tronweb = {} } = this.stepParams[i];
        const res = await send(address, functionSelector, { parameters, options, callbacks, tronweb });
        if (res?.transaction?.txID) {
          this.completeNumber++;
          this.emit('signedAtStep', i+1);
        } else {
          if (!res.success && res.msg) {
            this.emit('errorAtStep', i+1, res.msg);
          } else {
            this.emit('errorAtStep', i+1, 'Unknown error');
          }
          return;
        }
      }
      
      if (this.completeNumber === this.stepParams.length) {
        this.emit('completedAllSteps');
      }
    } catch (error) {
      this.emit('errorAtStep', this.stepNumber+1, error);
    }
  }
}

export const SignSteps = new Signs();
