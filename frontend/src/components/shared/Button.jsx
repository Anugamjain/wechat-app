import React from "react";

const Button = ( {text, onClick} ) => {
  return (
    <div className="flex justify-center mt-9 text-[16px] font-bold cursor-pointer mb-2">
      <button onClick={onClick} className="flex items-center px-2 space-x-2 bg-[#0077ff] hover:bg-[#3764bd] rounded-xl transition-all transition-500 ease-in-out">
        <span> {text} </span>
        <img src="/images/arrow-forward.png" alt="arrow" className="h-8 w-8" />
      </button>
    </div>
  );
};

export default Button;
