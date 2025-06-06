import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import AddRoomModal from "../components/AddRoomModal";
import { getAllRooms } from "../http";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  
  const [rooms, setRooms] = useState([]);

  function modalHandler(){
    setShowModal(true);
  }

  useEffect(() => {
    async function fetchRooms() {
      const {data} = await getAllRooms();
      setRooms(data.rooms);
    }
    fetchRooms();
  }, []);

  return (
    <div className="mx-10 p-10">
      {/* header */}
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <span className="mr-4 font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60%] after:h-1 after:bg-[#0077ff] after:rounded-[10px]"> All Voice Rooms </span>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 min-w-[300px] bg-[#262626] rounded-xl"
            />
            <img
              src="/images/search-icon.png"
              alt="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
          </div>
        </div>
        <div className="relative">
          <button
            onClick={modalHandler}
            type="text"
            className="pl-10 pr-4 py-2 w-auto font-bold bg-[#20BD5F] hover:bg-[#258843] rounded-3xl"
          >
            <img
            src="/images/add-room-icon.png"
            alt="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
            Start a room
          </button>
        </div>
      </div>

      {/* rooms grid */}
      <div className="grid grid-cols-4 p-3 gap-5">
        {rooms.map(room => <RoomCard key={room.id} room={room}/>)}
      </div>
      {showModal && <AddRoomModal closeModal = {() => setShowModal(false)}/>}
    </div>
  );
};

export default Rooms;
