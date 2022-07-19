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
  private currentStepNumber: number = 0;
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

  public getCurrentStepNumber = () => {
    return this.currentStepNumber;
  };

  public executeContinuousSigns = async (params: Array<TriggerType>) => {
    this.completeNumber = 0;
    this.currentStepNumber = 1;
    this.stepParams = params;

    this.continueCurrentSignSteps();
  }

  public continueCurrentSignSteps = async () => {
    try {
      for (let i = this.currentStepNumber; i <= this.stepParams.length; i++) {
        this.currentStepNumber = i;
        this.emit('startAtStep', i);

        const { address, functionSelector, parameters = [], options = {}, callbacks = () => {}, tronweb = {} } = this.stepParams[i-1];
        const res = await send(address, functionSelector, { parameters, options, callbacks, tronweb });
        if (res?.transaction?.txID) {
          this.completeNumber++;
          this.emit('signedAtStep', i);
        } else {
          if (!res.success && res.msg) {
            this.emit('errorAtStep', i, res.msg);
          } else {
            this.emit('errorAtStep', i, 'Unknown error');
          }
          return;
        }
      }
      
      if (this.completeNumber === this.stepParams.length) {
        this.emit('completedAllSteps');
      }
    } catch (error) {
      this.emit('errorAtStep', this.currentStepNumber, error);
    }
  }
}

export const SignSteps = new Signs();
