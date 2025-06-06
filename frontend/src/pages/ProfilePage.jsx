import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { getUser } from '../http';

const ProfilePage = () => {
  const navigate = useNavigate();
  const {user: activeUser} = useSelector((state) => state.auth);
  const {id} = useParams();
  const [user, setUser] = useState(null);

  const handleFollow = () => {

  };

  const handleUpdate = () => {
    navigate('/update');
  }

  useEffect(() => {
    const fetchdata = async () => {
      const {data} = await getUser(id);
      setUser(data.user);
    };
    fetchdata();
  }, [id]);

  return (
    <div className="ml-[60px]">
      <div className="flex justify-between items-center my-4">
        <span className="text-[20px] ml-[1rem] relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[120%] after:h-1 after:bg-[#0077ff] after:rounded-[10px]">
          Profile
        </span>

        {id === activeUser.id && (
          <button
            className="bg-[#0077ff] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#005fcc] transition-all duration-200 mr-10"
            onClick={handleUpdate}
          >
            Update Profile
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="bg-black w-[100px] h-[100px] rounded-[50%] my-9 mr-4"
            style={{ borderWidth: "3px", borderColor: "#0277ff" }}
          >
            <img
              className="w-full h-full rounded-[50%]"
              src={user?.avatar}
              alt="user avatar"
            />
          </div>
          <span className="text-[25px]"> {user?.name} </span>
          <button
            onClick={handleFollow}
            className="bg-[#0277ff] font-bold rounded-3xl w-[100px] h-[40px] ml-10"
          >
            Follow
          </button>
        </div>

        <div className="bg-[#222323] h-[80px] w-[200px] flex justify-around items-center rounded-lg mr-10">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">25</span>
            <span className="text-sm">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">0</span>
            <span className="text-sm">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage
