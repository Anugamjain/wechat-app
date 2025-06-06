import React, { useState } from 'react'
import Name from './registrationSteps/Name';
import Avatar from "./registrationSteps/Avatar";

const Activate = () => {
  const [step, setStep] = useState(1);

   const steps = {
      1: Name,
      2: Avatar
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

export default Activate
