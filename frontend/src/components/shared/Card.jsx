import React from "react";

const Card = ({ title, icon, children }) => {
  return (
   <div className="flex items-center justify-center min-h-[80vh]">
    <div className="w-[500px] max-w-[90%] min-h-[300px] bg-[#2e2c2c] p-[30px] rounded-xl">
      <div className="flex items-center justify-center space-x-3 mb-3">
        {icon && <img src={`/images/${icon}.png`} alt="logo" />}
        <span className="text-white text-[22px] font-semibold">{title}</span>
      </div>
      {children}
    </div>
    </div>
  )
};

export default Card;
