import React, { useEffect, useRef } from "react";
import {
  isFirstMessage,
  isSameSender,
  isSameSenderPosition,
  isSameUser,
} from "../../helper/ChatLogics";
import { useSelector } from "react-redux";
import UserProfileModal from "./UserProfileModal";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages }) => {
  const { selectedChat, user, userName } = useSelector((state) => state.chat);
  const isLight = useSelector((state) => state.lightDark.isLight);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  console.log(user);

  function formatTime(createdAt) {
    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  }

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div
            className={`flex ${
              (!isSameUser(messages, message, index) &&
                !isSameSender(messages, message, index, user.id) &&
                !isSameSenderPosition(messages, message, index, user.id)) ||
              isFirstMessage(messages, index, user.id)
                ? "flex-row-reverse"
                : "flex-row"
            }`}
            key={message._id}
          >
            {
              <div
                className={`flex ${
                  (selectedChat.isGroupChat &&
                    !isSameUser(messages, message, index) &&
                    isSameSender(messages, message, index, user.id)) ||
                  isFirstMessage(messages, index, user.id)
                    ? "mb-2"
                    : ""
                }`}
              >
                {(selectedChat.isGroupChat &&
                  !isSameUser(messages, message, index) &&
                  isSameSender(messages, message, index, user.id)) ||
                isFirstMessage(messages, index, user.id) ? (
                  <span className="w-[25px] h-[25px] rounded-full m-1">
                    <UserProfileModal user={message.sender}>
                      <img
                        src={message.sender.profile}
                        className="w-[25px] h-[25px] rounded-full select-none"
                      />
                    </UserProfileModal>
                  </span>
                ) : selectedChat.isGroupChat &&
                  isSameSenderPosition(messages, message, index, user.id) ? (
                  <div className="w-[25px] h-[25px] m-1"></div>
                ) : (
                  ""
                )}

                <div
                  className={`${
                    !isLight ? "bg-gray-100" : "bg-slate-500 text-white"
                  } mx-1 my-[0.5px] rounded-xl py-[5px] px-[10px] max-w-[100%] ${
                    message.content.length < 20 ? "pr-12" : "pb-3"
                  } items-end gap-2 flex flex-col relative`}
                >
                  <span
                    className={`break-words xsm:max-w-[9rem] max-w-[35rem] md:max-w-[15rem]  sm:max-w-[10rem] lg:max-w-[18rem] xl:max-w-[24rem]  max-xl:max-w-[25rem] 2xl:max-w-[27rem] max-2xl:max-w-[30rem] flex flex-col`}
                  >
                    {selectedChat.isGroupChat &&
                    isSameSender(messages, message, index, user.id) ? (
                      <span
                        className={`text-[10px] ${
                          !isLight ? " text-gray-500" : "text-gray-100"
                        } select-none`}
                      >
                        {message.sender.name}
                      </span>
                    ) : (
                      ""
                    )}

                    <span>{message.content}</span>
                  </span>
                  <span
                    className={`${
                      !isLight ? "text-gray-800" : "text-gray-300"
                    } ${
                      message.content.length > 20 ? "pt-1" : ""
                    } text-[9px] select-none text-nowrap absolute bottom-0.5 right-1`}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            }
          </div>
        ))}
      <div ref={chatEndRef}></div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
