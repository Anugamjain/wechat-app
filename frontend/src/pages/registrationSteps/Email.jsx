import React, { useState } from 'react'
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import TextInput from '../../components/shared/TextInput';

const Email = ({nextStep}) => {
  const [email, setEmail] = useState("abc@gmail.com");

  return (
    <div>
      <Card icon="email-emoji" title={"Enter Your Email 🚀"}>
      <div className="flex flex-col items-center mt-10">
          <TextInput
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={() => nextStep()} text="Next" />
          <p className="text-[#c4c5c5] w-[80%] mx-0 my-auto mt-[20px] text-center text-[15px]">
            By entering your email, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Email
