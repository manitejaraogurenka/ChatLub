import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chat-slice";
import LoaderSpinner from "./Loader";
import getSender from "../../helper/ChatLogics";
import UserProfileModal from "./UserProfileModal";
import { messageActions } from "../../store/message-slice";

const MyChats = () => {
  const { selectedChat, user, chats, fetchChatsAgain } = useSelector(
    (state) => state.chat
  );
  const { notifications, fetchMessagesAgain } = useSelector(
    (state) => state.message
  );
  const isLight = useSelector((state) => state.lightDark.isLight);
  const dispatch = useDispatch();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      dispatch(chatActions.setChats(data));
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  function formatTime(createdAt) {
    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  }

  useEffect(() => {
    if (fetchChatsAgain) {
      fetchChats();
      dispatch(chatActions.setFetchChats(false));
    }
    // eslint-disable-next-line
  }, [fetchChatsAgain, dispatch]);

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <div className="w-full h-full">
      {chats ? (
        chats.map((chat) => (
          <div
            className="m-2 flex flex-col h-full"
            key={chat._id}
            onClick={() => {
              dispatch(chatActions.setSelectedChat(chat));
              {
                notifications &&
                  notifications.map((notification) =>
                    dispatch(
                      messageActions.setNotifications(
                        notifications.filter(
                          (n) => n.chat._id !== notification.chat._id
                        )
                      )
                    )
                  );
              }
              dispatch(chatActions.updateUserName(chat.chatName));
              dispatch(chatActions.setUpdateProfile(chat.groupProfile));
            }}
          >
            <div
              className={`w-full text-md font-semibold flex cursor-pointer items-center select-none ${
                selectedChat._id === chat._id
                  ? "bg-primary text-white scale-[103%] shadow-md rounded-md border-2 border-white"
                  : isLight
                  ? "bg-slate-500 text-white"
                  : "bg-white text-black"
              } hover:bg-primaryLight rounded-md hover:scale-[102.5%]`}
            >
              <span
                className="border-white rounded-full border-2 w-8.5 h-8.5 m-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <UserProfileModal
                  user={!chat.isGroupChat ? getSender(user, chat.users) : chat}
                >
                  <img
                    src={
                      !chat.isGroupChat
                        ? getSender(user, chat.users).profile
                        : chat.groupProfile
                    }
                    className="rounded-full w-8 h-8 bg-white"
                    alt={
                      !chat.isGroupChat
                        ? getSender(user, chat.users).name
                        : chat.chatName
                    }
                    draggable={false}
                  />
                </UserProfileModal>
              </span>
              <div className="flex text-ellipsis truncate flex-grow">
                <div className="flex-1 truncate items-baseline flex flex-col">
                  <span>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users).name
                      : chat.chatName}
                  </span>
                  {!notifications && ""}
                  {notifications &&
                    notifications
                      .reduce((uniqueNotifications, notification) => {
                        if (
                          !uniqueNotifications.some(
                            (n) => n.chat._id === notification.chat._id
                          )
                        ) {
                          uniqueNotifications.push(notification);
                        }
                        return uniqueNotifications;
                      }, [])
                      .map((notification) => (
                        <span
                          className="text-[12px] text-ellipsis truncate w-full pb-1"
                          key={notification._id}
                        >
                          {(notification.chat.isGroupChat &&
                            chat.isGroupChat &&
                            chat._id === notification.chat._id && (
                              <>
                                <span>{notification.sender.name}: </span>
                                <span>{notification.content}</span>
                              </>
                            )) ||
                            (!notification.chat.isGroupChat &&
                              chat._id === notification.chat._id &&
                              notification.content)}
                        </span>
                      ))}
                </div>
                <span>
                  {notifications &&
                    notifications
                      .reduce((uniqueNotifications, notification) => {
                        if (
                          !uniqueNotifications.some(
                            (n) => n.chat._id === notification.chat._id
                          )
                        ) {
                          uniqueNotifications.push(notification);
                        }
                        return uniqueNotifications;
                      }, [])
                      .map((notification) => (
                        <span
                          className="text-[12px] text-ellipsis truncate w-full flex flex-grow pb-1"
                          key={notification._id}
                        >
                          {(notification.chat.isGroupChat &&
                            chat.isGroupChat &&
                            chat._id === notification.chat._id && (
                              <span className=" mr-1 text-[10px]">
                                {formatTime(notification.createdAt)}
                              </span>
                            )) ||
                            (!notification.chat.isGroupChat &&
                              chat._id === notification.chat._id && (
                                <span className=" mr-1  text-[10px]">
                                  {formatTime(notification.createdAt)}
                                </span>
                              ))}
                        </span>
                      ))}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className=" ml-[30%] mt-[30%]">
          <LoaderSpinner height="60%" width="60%" />
        </div>
      )}
    </div>
  );
};

export default MyChats;
