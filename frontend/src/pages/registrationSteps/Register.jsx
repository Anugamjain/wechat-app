import React, { useState } from "react";
import Phone from "./Phone";
import Email from "./Email";

const Register = ({ nextStep }) => {
  const [type, setType] = useState("phone");

  const PhoneEmailMap = {
    phone: Phone,
    email: Email,
  };

  const Component = PhoneEmailMap[type];

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex text-white mb-3 space-x-3">
        <button
          onClick={() => setType("phone")}
          className = {"w-[50px] h-16 px-2 border-none outline-none border-r-4 cursor-pointer rounded-lg "
            +(type === "phone" ? "bg-[#0077ff]" : "bg-[#2e2c2c]")}
        >
          <img src="/images/phone-white.png" alt="phone" />
        </button>
        <button
          onClick={() => setType("email")}
          className={"w-[50px] h-16 pl-[10px] border-none outline-none border-r-4 cursor-pointer rounded-lg "
            +(type === "email" ? "bg-[#0077ff]" : "bg-[#2e2c2c]")}
        >
          <img src="/images/mail-white.png" alt="mail" />
        </button>
      </div>
      <Component nextStep={nextStep} />
    </div>
  );
};

export default Register;
