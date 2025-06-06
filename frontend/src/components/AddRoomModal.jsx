import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "./shared/TextInput";
import {createRoom} from '../http/index';

const RoomTypeBox = ({ img, txt, type, setRoomType }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${ type===txt ? 'bg-[#2e2e2e]' : ''} rounded-2xl h-[120px]`} onClick={setRoomType}>
      <img src={`/images/${img}.png`} alt={`${img}`} />
      <span className="text-sm font-medium">{txt}</span>
    </div>
  );
};

const AddRoomModal = ({closeModal}) => {
  const [roomType, setRoomType] = useState('Open');
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  async function createRoomHandler() {
    if (topic === '') return;
    try {
      const res = await createRoom({topic, roomType});
      console.log(res.data);
      const room = res.data;
      navigate(`/room/${room.id}`);
    } catch (err) {
      console.log("Can't create room", err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000000] bg-opacity-60 z-50 flex justify-center items-center">
      <div className="w-[50%] max-w-[500px] bg-[#1d1d1d] p-5 rounded-lg relative">
        <button
          onClick={() => closeModal()}
          className="absolute top-2 right-2 text-xl md:text-2xl font-bold hover:text-gray-400"
        >
          &times;
        </button>
        <div className="p-3">
          <h2 className="my-[4px] text-xl md:text-2xl">
            Enter the Topic to be discussed
          </h2>
          <TextInput
            value = {topic}
            onChange = {(e) => setTopic(e.target.value)}
            style={{
              width: "80%",
              borderRadius: "6px",
              margin: "5px",
              placeHolder: "Your topic here",
            }}
          />
          <span className="mt-3 text-base md:text-lg">Room types</span>
          <div className="grid grid-cols-3 gap-7">
            <RoomTypeBox img="globe" txt="Open" type={roomType} setRoomType={() => setRoomType('Open')}/>
            <RoomTypeBox img="social" txt="Social" type={roomType} setRoomType={() => setRoomType('Social')}/>
            <RoomTypeBox img="lock" txt="Private" type={roomType} setRoomType={() => setRoomType('Private')}/>
          </div>
        </div>
        <div className="flex flex-col items-center m-2">
          <span className="text-sm md:text-base">Start a room, open to everyone</span>
          <button onClick={createRoomHandler} className="flex justify-center items-center bg-[#20bd5f] p-2 rounded-3xl w-[30%] mt-2">
            <img src="/images/celebration.png" alt="celebration" />
            <span className="ml-1 text-sm md:text-base">Lets Go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
