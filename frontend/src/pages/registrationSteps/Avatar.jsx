import React, { useState } from "react";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../store/activationSlice";
import {setAuth} from "../../store/authSlice";
import { activate } from "../../http";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/shared/Loader";

const Avatar = ({ nextStep }) => {
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState(avatar);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitAvatar = async () => {
    if (!name || !avatar) return;

    setLoading(true);
    try {
      const res = await activate({name, avatar});
      const {data} = res;
      if (data.auth) {
        dispatch(setAuth(data.user));
      }
      navigate("/rooms"); 
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };

  if (loading)  return <Loader message='Activation in Progress...'/>
  
  return (
    <div>
      <Card icon="monkey-emoji" title={`okay, ${name}`}>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center my-[10px]">
            <p className="text-[#c4c5c5] w-[100%] text-center text-[15px]">
              How's this photo?
            </p>
          </div>
          <div className="w-[110px] h-[110px] border-2 border-[#0077ff] rounded-full overflow-hidden">
            <img className=" object-cover" src={image} alt="avatar" />
          </div>
          <div className="mt-3 -mb-5">
            <input type="file" id="avatarInput" onChange={captureImage} className="hidden" />
            <label className="text-[#0077ff] cursor-pointer" htmlFor="avatarInput" > Choose a different Photo</label>
          </div>
          <Button onClick={submitAvatar} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default Avatar;
