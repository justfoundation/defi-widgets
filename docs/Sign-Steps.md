# What is sign-steps

sign-steps helps dapp to execute multiple contract signing steps via the TronLink Chrome extension. With sign-steps, dapp developers will be able to:

- execute multiple contract signing steps
- listen to contract signing and reject events

# Get Started

### Installation

- `npm i`

### Run

- `npm run start`

### Build

- `npm run build`


# Execute multiple contract signing steps

Developer can execute multiple contract signing steps using the `executeContinuousSigns` async method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| params | Array of parameters for each contract signing step | Array of param object |

### Example

```
const params1 = {
  address: 'TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL',
  functionSelector: 'approve(address,uint256)',
  parameters: [
    { type: 'address', value: 'TSgZncDVzLq5SbEsCKAeviuG7nPKtJwRzU' },
    { type: 'uint256', value: MAX_UINT256 }
  ],
  options: {},
}
const params2 = {
  address: 'TSgZncDVzLq5SbEsCKAeviuG7nPKtJwRzU',
  functionSelector: 'mint(uint256)',
  parameters: [{ type: 'uint256', value: '100' }],
  options: {},
}
executeContinuousSigns([params1, params2]);
```

# Continue the execution at the current step

Developer can continue the current continuous sign steps at current step using the `continueCurrentSignSteps` method

### Example
```
continueCurrentSignSteps();
```

# Listen to contract signing events

Developer can listen to the contract signing events using the `on` method

### Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| event | Name of the event to listen | String |
| callback | Call back function in response to the event | Function |

### Event action name

| Event | Description |
| ----------- | ----------- |
| startAtStep | Start to execute at this step |
| signedAtStep | User signed the contract at this step |
| errorAtStep | Contract signing encounter error at this step |
| completedAllSteps | Completed all contract signing of the current continuous signing execution |

### Example
```
SignSteps.on('startAtStep', (stepNumber) => {
  updateStatusAtStep(stepNumber, StepStatus.Active)
})
SignSteps.on('signedAtStep', (stepNumber) => {
  updateStatusAtStep(stepNumber, StepStatus.Completed)
})
SignSteps.on('errorAtStep', (stepNumber, errorMsg) => {
  updateStatusAtStep(stepNumber, StepStatus.Error)
})
SignSteps.on('completedAllSteps', () => {
  setDidFinishAllSteps(true)
  removeSignStepsListeners()
})
```

# Remove the contract signing events listener

Developer can remove the contract signing events listener using the `off` method

### Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| event | Name of the event to listen | String |
| callback | Call back function in response to the event | Function |

### Example
```
SignSteps.off('startAtStep', startEventCallback)
SignSteps.off('signedAtStep', signedEventCallback)
SignSteps.off('errorAtStep', errorEventCallback)
SignSteps.off('completedAllSteps', completedAllStepsCallback)
```

# Get the current step number

Developer can get the current step number using the `getCurrentStepNumber` method

### Response

The step number of the existing continuous signature

### Example

```
getCurrentStepNumber()
```