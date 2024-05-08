import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfileModal from "../miscellaneous/UserProfileModal";
import { chatActions } from "../../store/chat-slice";
import { messageActions } from "../../store/message-slice";
import axios from "axios";
import getSender from "../../helper/ChatLogics";
import { IoCall } from "react-icons/io5";
import { MdVideocam } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import { FaMicrophone } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import styles from "../../styles/Chat.module.css";
import LoaderSpinner from "./Loader";
import { FormControl, Input } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import "../../styles/Chat.module.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const SingleChat = () => {
  const { selectedChat, user, userName } = useSelector((state) => state.chat);
  const { notifications, fetchMessagesAgain } = useSelector(
    (state) => state.message
  );
  const isLight = useSelector((state) => state.lightDark.isLight);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast(
          (t) => (
            <span className="flex items-center gap-1">
              <b>Message sending failed!</b>
              <button onClick={() => toast.dismiss(t.id)}>
                <AiFillCloseCircle color="red" size={23} />
              </button>
            </span>
          ),
          {
            duration: 3000,
          }
        );
      }
    }
  };

  const fetchMessages = async (e) => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Failed loading messages!</b>
            <button onClick={() => toast.dismiss(t.id)}>
              <AiFillCloseCircle color="red" size={23} />
            </button>
          </span>
        ),
        {
          duration: 3000,
        }
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    dispatch(messageActions.setFetchMessages(false));
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notifications, "-----------------");

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(
            messageActions.setNotifications([
              newMessageRecieved,
              ...notifications,
            ])
          );
          dispatch(messageActions.setFetchMessages(true));
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (fetchMessagesAgain) {
      fetchMessages();
    }
  }, [fetchMessagesAgain]);

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-full">
          <div
            className={`w-full flex justify-between items-center font-semibold ${
              styles.chatTopGlass
            } ${
              !isLight
                ? "bg-primaryLight text-black"
                : "bg-primaryLight text-white"
            }`}
          >
            <div className="flex justify-between cursor-pointer p-2 items-center mx-1.5">
              {!selectedChat.isGroupChat ? (
                <UserProfileModal user={getSender(user, selectedChat.users)}>
                  <div className="flex gap-0.5 items-center">
                    <span className="border-white rounded-full border-2 w-[35px] h-[35px] m-2">
                      <img
                        alt={getSender(user, selectedChat.users).name}
                        src={getSender(user, selectedChat.users).profile}
                        className="rounded-full w-[32px] h-[32px] bg-white"
                      />
                    </span>
                    <span className="text-lg">
                      {getSender(user, selectedChat.users).name}
                    </span>
                  </div>
                </UserProfileModal>
              ) : (
                <UserProfileModal user={selectedChat}>
                  <div className="flex gap-0.5 items-center justify-between truncate overflow-ellipsis">
                    <span className="bg-white border-white rounded-full border-2 w-[35px] h-[35px] m-2">
                      <img
                        src={selectedChat.groupProfile}
                        className="rounded-full w-[32px] h-[32px]"
                        alt={selectedChat.chatName}
                      />
                    </span>
                    <span className="text-lg">
                      {userName || selectedChat.chatName}
                    </span>
                  </div>
                </UserProfileModal>
              )}
            </div>
            <div className="flex gap-0.5 items-center justify-between ">
              <span className="m-1 hover:scale-105 active:scale-100 p-1 border-2 border-white rounded-md">
                <IoCall size={24} color="white" />
              </span>
              <span className="m-1 hover:scale-105 active:scale-100 p-1 border-2 border-white rounded-md">
                <MdVideocam size={24} color="white" />
              </span>
              <span className="m-1 hover:scale-105 active:scale-100 p-1.5 border-2 border-white rounded-md rotate-90">
                <FaMagnifyingGlass size={20} color="white" />
              </span>
            </div>
          </div>
          <div
            className={`flex h-[89%] flex-col justify-between font-semibold ${styles.chatTopGlass}`}
          >
            <div className="flex flex-grow flex-col-reverse overflow-y-scroll">
              {loading ? (
                <span className=" flex-grow flex justify-center items-center">
                  <LoaderSpinner width={"80%"} height={"80%"} />
                </span>
              ) : (
                <span
                  className={`flex ${styles.messages} flex-col-reverse my-1`}
                >
                  <ScrollableChat messages={messages} />
                </span>
              )}
            </div>
            <span className="flex flex-row bg-primary items-center gap-1 p-2">
              <span className=" cursor-pointer hover:scale-105 active:scale-100 p-2 border-2 border-white rounded-md">
                <MdOutlineEmojiEmotions size={20} color="white" />
              </span>
              <span className=" cursor-pointer hover:scale-105 active:scale-100 p-2 border-2 border-white rounded-md">
                <GrAttachment size={20} color="white" />
              </span>
              <FormControl
                onKeyDown={sendMessage}
                isRequired
                bg={"white"}
                borderRadius={"0.5rem"}
              >
                <Input
                  variant="filled"
                  placeholder="Type a message..."
                  onChange={typingHandler}
                  value={newMessage}
                  bg={"white"}
                />
              </FormControl>
              <span className=" cursor-pointer hover:scale-105 active:scale-100 p-2 border-2 border-white rounded-md">
                <FaMicrophone size={20} color="white" />
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-24">
          <div className="flex flex-col items-center mx-auto my-auto select-none">
            <img
              className="w-44"
              alt="ChatLub Logo"
              src="/assets/logo/ChatLub_Logo.png"
              draggable={false}
            />
            <span className=" text-white text-5xl font-bold mb-3">ChatLub</span>
            <span className=" text-white text-md font-bold">
              Where Conversations Come Alive!
            </span>
            <span className=" text-white text-md mt-20">
              Smooth, Secure, and Seamless Communication...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleChat;
