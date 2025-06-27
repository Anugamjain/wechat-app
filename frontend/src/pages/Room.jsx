import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useWebRTC } from "../hooks/useWebRTC";
import { useEffect, useState } from "react";
import { getRoomById, deleteRoomByRoomId } from "../http";

const borderColors = [
  "#FF6B6B", // coral red
  "#6BCB77", // mint green
  "#4D96FF", // vivid blue
  "#FFC300", // sunflower yellow
  "#845EC2", // deep violet
  "#FF9671", // soft orange
  "#00C9A7", // teal
  "#FF5DA2", // pink
  "#2C73D2", // cobalt blue
  "#F9A826", // mango orange
  "#F59E0B", // amber
];

const UserGrid = ({users, provideRef, handleMute}) => {
  const [muted, setMuted] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const handleMuteClick = (userId) => {
    if (userId !== user.id) return;

    console.log('mute clicked');
    const newMuted = !muted;
    setMuted(newMuted);
    handleMute(newMuted);
  };

  const getRandomColor = () => {
    const rand = Math.floor(10 * Math.random());
    return borderColors[rand];
  };

  useEffect(() => {

  }, [muted]);

  return (
    <div className="grid grid-cols-10 gap-2 mt-[-20px] mx-5">
      {users.map((user) => (
        <div
          className="bg-black w-[60px] h-[60px] rounded-[50%] my-9"
          style={{ borderWidth: "2px", borderColor: getRandomColor() }}
          key={user.id}
        >
          <audio ref={(instance) => provideRef(instance, user.id)} autoPlay />
          <div className="relative w-[100%] h-[100%]">
            <img
              className="w-full h-full rounded-[50%]"
              src={user.avatar}
              alt="user avatar"
            />
            <button
              className="absolute bg-[#000000] rounded-full bottom-0 right-0 w-[20px] h-[20px]"
              onClick={() => handleMuteClick(user.id)}
            >
              {user.muted ? (
                <img
                  className="h-[100%]"
                  src={'/images/mic-mute.png'}
                  alt="mic-mute-icon"
                />
              ) : (
                <img
                  className="h-[100%]"
                  src={'/images/mic.png'}
                  alt="mic-icon"
                />
              )}
            </button>
          </div>
          <h2>{user.name} </h2>
        </div>
      ))}
    </div>
  );
};

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteRoomByRoomId(roomId);
      navigate("/rooms");
    }
  };

  // Fetch Room Data
  useEffect(() => {
    const fun = async () => {
      const { data } = await getRoomById(roomId);
      setRoom(data.roomInfo);
      console.log("Room Data:", data.roomInfo);
    };
    fun();
  }, [roomId]);

  return (
    <div className="">
      <div className="flex justify-between items-center mx-17 p-9">
        <button
          onClick={() => navigate("/rooms")}
          className="flex gap-1 rounded-2xl px-5 py-1 cursor-pointer "
        >
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span className="font-bold ml-[1rem] relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60%] after:h-1 after:bg-[#0077ff] after:rounded-[10px]">
            All Voice Rooms
          </span>
        </button>
        { room && room.adminId.id === user.id && (
          <div>
            <button onClick={handleDeleteRoom} className="bg-[#e63535] px-2 py-[4px] rounded-lg">
              Delete Room
            </button>
          </div>
        )}
      </div>
      <h1 className="mt-[-12px] mb-2 ml-8 font-bold">All connected Clients</h1>
      <div className="bg-[#282828] min-h-screen rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="p-5 font-bold">
            {room ? room.topic : "Development is Hard"}
          </h2>
          <div className="flex items-center gap-3 mr-4">
            <button className="rounded-[50%] h-[30px] w-[30px] bg-[#0d0d0d]">
              <img className="p-1" src="/images/palm.png" alt="palm" />
            </button>
            <button className="flex items-center justify-center rounded-2xl h-[30px] w-[150px] bg-[#0d0d0d]" onClick={() => navigate("/rooms")}>
              <img className="mr-1" src="/images/win.png" alt="win" />
              <span> Leave quietly </span>
            </button>
          </div>
        </div>

        <UserGrid users = { room ? clients.filter((client) => room.speakers.some(speaker => speaker._id === client.id)) : []} provideRef = {provideRef} handleMute={handleMute}/> 

        <div className="m-4">
          <h1 >Others in the Room</h1>
        </div>

        <UserGrid users = { room ? clients.filter((client) => !room.speakers.some(speaker => speaker._id === client.id)) : []} provideRef = {provideRef} handleMute={handleMute}/> 
      </div>
    </div>
  );
};

export default Room;