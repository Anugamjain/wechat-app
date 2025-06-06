import React, { useState } from "react";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import TextInput from "../../components/shared/TextInput";
import { useSelector, useDispatch } from "react-redux";
import { setName } from "../../store/activationSlice";

const Name = ({ nextStep }) => {
  const [fullName, setFullName] = useState(
    useSelector((state) => state.activate.name)
  );
  const dispatch = useDispatch();

  const submitName = () => {
    if (!fullName) {
      return;
    }
    dispatch(setName(fullName));

    nextStep();
  };

  return (
    <div>
      <Card icon="goggle-emoji" title="Whats your full name?">
        <div className="flex flex-col items-center mt-10">
          <TextInput
            placeholder={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="flex items-center justify-center mt-[30px]">
            <p className="text-[#c4c5c5] w-[70%] text-center text-[15px]">
              People use real names at coder's house :)
            </p>
          </div>
          <Button onClick={submitName} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default Name;
