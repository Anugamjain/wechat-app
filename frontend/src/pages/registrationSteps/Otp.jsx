import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import navigate
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import TextInput from "../../components/shared/TextInput";
import { verifyOtp } from "../../http";
import { setAuth } from "../../store/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Otp = () => {
  const [otp, setOtp] = useState("0000");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contact, hash } = useSelector((state) => state.auth.otp);

  async function submitOtp() {
    if (otp === '0000' || otp.length !== 4)  return;
    const type = contact?.includes('@') ? 'email' : 'phone';
    try {
      const res = await verifyOtp({ contact, hash, otp, type });
      console.log(res.data);
      dispatch(setAuth(res.data.user));
      navigate("/activate");  
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Card icon="lock-emoji" title="Enter the OTP we just sent you">
        <div className="flex flex-col items-center mt-10">
          <TextInput
            placeholder={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={submitOtp} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default Otp;
