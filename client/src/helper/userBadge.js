import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      key={user._id}
      className="gap-[0.15rem] text-white font-semibold border-[0.08rem] border-white flex items-center max-w-fit p-[0.1rem] m-0.5 bg-primary rounded-lg text-xs select-none"
    >
      <img
        src={user.profile}
        alt={user.name}
        className="w-3 rounded-full p-0 m-0 h-3"
      />
      {user.name}
      <span
        className="text-slate-800 rounded-full cursor-pointer"
        onClick={handleFunction}
      >
        <IoMdCloseCircle size={14} color="#404040" />
      </span>
    </div>
  );
};

export default UserBadgeItem;
