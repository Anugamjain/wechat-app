import React, { useState } from "react";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import TextInput from "../../components/shared/TextInput";
import { sendOtp } from "../../http";
import {useDispatch} from 'react-redux';
import { setOtp } from "../../store/authSlice";

const Phone = ({ nextStep }) => {
  const [phoneNo, setPhoneNo] = useState("+911234567890");
  const dispatch = useDispatch();

  async function getOtp () {
    try{
      const res = await sendOtp({reqType: 'phone' ,phone: phoneNo});
      const {contact, hash} = res.data;
      console.log(res.data);
      dispatch(setOtp({contact, hash}));
      nextStep();
    } catch (err) {
      alert("Invalid Phone Number");
      setPhoneNo("");
      console.log(err);
    }
  }
  return (
    <div>
      <Card icon="phone" title={"Enter Your Phone Number🚀"}>
        <div className="flex flex-col items-center mt-10">
          <TextInput
            value={phoneNo}  
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          <Button onClick={getOtp} text="Next" />
          <p className="text-[#c4c5c5] w-[80%] mx-0 my-auto mt-[20px] text-center text-[15px]">
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Phone;
