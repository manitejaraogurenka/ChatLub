import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Chat.module.css";
import ToggleLightDark from "../components/miscellaneous/ToggleLightDark";
import { lightDarkActions } from "../store/lightDark";
import { IoSettings } from "react-icons/io5";
import Sidebar from "../components/miscellaneous/Sidebar";
import UsersArea from "../components/miscellaneous/UsersArea";
import { chatActions } from "../store/chat-slice";
import { Toaster } from "react-hot-toast";
import ChatsArea from "../components/miscellaneous/ChatsArea";

const Chats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.chat.user);
  const isLight = useSelector((state) => state.lightDark.isLight);

  useEffect(() => {
    if (!user || !user.name || !user.email) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(chatActions.setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <div
      className={`${styles.chatBg} overflow-clip h-screen flex flex-col transition-all duration-500`}
      style={{
        backgroundImage: `url('${
          isLight
            ? "assets/backgrounds/ChatDark_1.jpg"
            : "assets/backgrounds/ChatLight_1.jpg"
        }')`,
      }}
    >
      <Toaster position="top-right" reverseOrder={false}></Toaster>
      <div
        className={`flex items-center justify-between ${styles.chatGlass} p-5 w-full h-[9%] `}
      >
        <div className="flex justify-end w-[60%]">
          <div className="flex gap-1 justify-center items-center bg-primary py-1 px-6 rounded-xl font-Poppins cursor-pointer w-fit shadow-lg">
            <img
              className="w-10 select-none"
              alt="ChatLub Logo"
              src="/assets/logo/ChatLub_Logo.png"
              draggable={false}
            />
            <h1 className="select-none text-3xl text-white font-bold">
              ChatLub
            </h1>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <ToggleLightDark
            isChecked={isLight}
            handleChange={() => {
              dispatch(lightDarkActions.setDark());
            }}
          />
          <span className="cursor-pointer inline-block transform transition-transform hover:rotate-180 hover:scale-105">
            <IoSettings size={25} color={isLight ? "white" : "black"} />
          </span>
        </div>
      </div>
      <div className="flex flex-row min-h-screen w-full">
        <Sidebar />
        <UsersArea />
        <ChatsArea />
      </div>
    </div>
  );
};

export default Chats;
