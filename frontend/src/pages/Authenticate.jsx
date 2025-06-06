import React, { useState } from 'react'
import Register from './registrationSteps/Register';
import Otp from './registrationSteps/Otp';

const Authenticate = () => {
   const [step, setStep] = useState(1);

   const steps = {
      1: Register,
      2: Otp,
   };

   const nextStep = () => {
      setStep(step + 1);
   };

   const Component = steps[step];

  return (
    <div>
      < Component nextStep = {nextStep} />
    </div>
  )
}

export default Authenticate
