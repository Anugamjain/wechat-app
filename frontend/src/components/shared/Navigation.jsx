import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../http";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const { data } = await logout();
      dispatch(setAuth(data.user));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="border-b-[1px] border-b-[#5c5c5c] m-2">
      <nav className="w-[1200px] max-w-[90%] mx-20 my-auto px-8 py-5 flex items-center justify-between">
        <Link
          to="/rooms"
          className="flex items-center space-x-2"
        >
          <img src="/images/logo.png" alt="logo" className="h-8 w-8" />
          <span className="text-[22px] font-semibold">WeChat</span>
        </Link>
        {isAuth && (
          <div className="flex justify-between items-center font-bold">
            <button className="flex items-center" onClick={() => navigate(`/profile/${user.id}`)}>
              <h3>{user.name}</h3>
              <img
                className="w-[50px] h-[50px] ml-[10px] mr-[20px] border-solid border-[2px] border-[#0077ff] rounded-[50%] object-cover"
                src={user.avatar}
                alt="avatar"
              />
            </button>
            <button
              className="flex items-center justify-center gap-1 bg-[#0077ff] text-white font-bold px-3 py-2 rounded-full"
              onClick={logoutHandler}
            >
              <img
                className="w-[20px] h-[20px]"
                src="/images/logout.png"
                alt="Logout"
              />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
