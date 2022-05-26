'use strict';

interface ResultType {
  success: boolean;
  msg?: string;
  data?: any;
}

export class SignSteps {
  public stepNumber: number = 0;
  public completeNumber: number = 0;

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

  public executeSignsSimple = async (functions: Array<Function>, { callbacks = () => {}}) => {
    this.completeNumber = 0;
    try {
      functions.map(async (func) => {
        await func();
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