import React from "react";
import {useNavigate} from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  function clickHandler() {
    navigate(`/room/${room.id}`);
  }

  return (
    <div onClick={clickHandler} className="bg-[#1d1d1d] p-5 rounded-xl hover:border-2 hover:border-[#0077ff] cursor-pointer">
      <h2>{room.topic}</h2>
      <div className="flex justify-between pt-10 m-3">
        <div className="relative w-[100px] h-[60px]">
          {room.speakers.map((speaker, index) => (
            <img
              key={speaker.id}
              className="w-10 h-10 rounded-full bg-white border-2 border-[#0077ff] object-cover absolute"
              style={{ top: `${index * 10}px`, left: `${index * 15}px` }}
              src={speaker.avatar}
              alt="speaker-avatar"
            />
          ))}
        </div>
        <div>
          {room.speakers.map((speaker) => (
            <div key={speaker.id} className="flex items-center">
              <span className="mr-2">{speaker.name}</span>
              <img src="/images/chat-bubble.png" alt="chat-image" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <span>{room.totalPeople}</span>
        <img className="h-4" src="/images/user-icon.png" alt="user-icon" />
      </div>
    </div>
  );
};

export default RoomCard;
