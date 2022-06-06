# Sign Steps


## Introduction
Interacting with contracts may involves multiple consecutive steps. Any failure in between will sabotage the whole process. End users have to confirm each step in the WEB UI or sign tractions using their wallet. 

In such use cases, developers could utilize visual components like <Steps/> with title, description, progress indicator, steps status, etc to clarify the work flow and comfort users. 


## Implementation tips
Any workflow or combination that requires wallet signature and/or user interaction multiple times can check `~/defi-demo/src/routes/transaction.js` as a reference for the sake of user experience.

The example demonstrates connecting users' wallet then sending TRX to another wallet.

Check the `Steps` component by [Ant Design](#https://ant.design/components/steps/) and/or the official document of any design system of your choices.
