import { StepStatus } from './constants';

export const StepInfo = (title, status = StepStatus.Pending) => { return { title: title, status: status } }
