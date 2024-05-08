import React, { useEffect, useRef, useState } from "react";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Modal,
  Image,
  ModalFooter,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import { chatActions } from "../../store/chat-slice";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { debounce } from "lodash";
import LoaderSpinner from "./Loader";
import { AiFillCloseCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import UserBadgeItem from "../../helper/userBadge";
import StyledTooltip from "../../helper/toolTip";

const UserProfileModal = ({ user, children }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user: currentChat,
    userName,
    selectedChat,
  } = useSelector((state) => state.chat);
  const isLight = useSelector((state) => state.lightDark.isLight);
  const profilePicture = useSelector((state) => state.chat.profilePicture);
  const [editAbout, setEditAbout] = useState(false);
  const [editName, setEditName] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [chatName, setChatName] = useState("");
  // const [chatProfile, setChatProfile] = useState("");
  const [hover, setHover] = useState(false);
  const [nameHover, setNameHover] = useState(false);
  const [showAbout, setShowAbout] = useState(true);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredAdminId, setHoveredAdminId] = useState(null);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentChat.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      dispatch(chatActions.setChats(data));
      return data;
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const textareaRef = useRef(null);
  const inputRef = useRef(null);

  const handleNameHover = (isHovering) => {
    setNameHover(isHovering);
  };
  useEffect(() => {
    if (editName) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [editName]);
  useEffect(() => {
    if (editAbout) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editAbout]);
  useEffect(() => {
    setAboutText(user.groupAbout || user.about);
  }, [user.groupAbout, user.about]);
  useEffect(() => {
    setChatName(user.chatName || user.name);
  }, [user.chatName, user.name]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      setSearchResult(null);
    };
  }, [error]);

  const handleDelete = (userTodelete) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== userTodelete._id)
    );
  };
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUsers]);

  const debouncedSearch = debounce(async (value) => {
    if (value) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${currentChat.token}`,
          },
        };
        const { data } = await axios.get(
          `/api/user/users?search=${value}`,
          config
        );

        const filteredUsers = data.filter(
          (Resultuser) =>
            !selectedChat.users.some(
              (groupUser) => groupUser.email === Resultuser.email
            )
        );

        setSearchResult(filteredUsers);
        setLoading(false);
      } catch (error) {
        setSearchResult([]);
        setError("No results.");
        setLoading(false);
      }
    } else {
      debouncedSearch.cancel();
      setLoading(false);
      setSearchResult([]);
    }
  }, 300);

  const handleSearch = (query) => {
    let value = query.trim();
    debouncedSearch(value);
  };

  const handleMakeAdmin = async (userToMakeAdmin) => {
    if (
      user.groupAdmin.some((groupUser) => userToMakeAdmin._id === groupUser._id)
    ) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>User already a group admin!</b>
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
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentChat.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadmin",
        { chatId: user._id, userId: userToMakeAdmin },
        config
      );

      toast.success("Made group admin!");
      dispatch(chatActions.setSelectedChat(data));
      setLoading(false);
      setSearchResult([]);
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Can't make group admin!</b>
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

  const handleRemoveAdmin = async (userToRemoveAdmin) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentChat.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremoveadmin",
        { chatId: user._id, userId: userToRemoveAdmin },
        config
      );

      dispatch(chatActions.setSelectedChat(data));
      setLoading(false);
      setSearchResult([]);
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Can't remove group admin!</b>
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

  const handleAddToGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>user already inn!</b>
            <button onClick={() => toast.dismiss(t.id)}>
              <AiFillCloseCircle color="red" size={23} />
            </button>
          </span>
        ),
        {
          duration: 3000,
        }
      );
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentChat.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: user._id,
          users: selectedUsers,
        },
        config
      );

      toast.success("Added to group!");

      dispatch(chatActions.setSelectedChat(data));
      setLoading(false);
      setSelectedUsers([]);
      setSearchResult([]);
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Can't add to group!</b>

            <button onClick={() => toast.dismiss(t.id)}>
              <AiFillCloseCircle color="red" size={23} />
            </button>
          </span>
        ),
        {
          duration: 3000,
        }
      );
      console.log(error);
      setLoading(false);
    }
  };

  const handleRemoveFromgroup = async (userToRemove) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentChat.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: user._id,
          userId: userToRemove._id,
        },
        config
      );
      toast.success("Removed user from group!");
      dispatch(chatActions.setSelectedChat(data));
      dispatch(chatActions.setFetchMessages(true));
      setLoading(false);
      setSearchResult([]);
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Can't remove user from group!</b>
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

  const handleClose = () => {
    setEditAbout(false);
    setEditName(false);
    setAboutText(aboutText || user.groupAbout || user.about);
    setChatName(userName || user.chatName || user.name);
    setSelectedUsers([]);
    setSearchResult([]);
    setLoading(false);
    setShowAbout(true);
    onClose();
  };
  const handleBlock = () => {
    onClose();
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (chatName !== user.chatName) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentChat.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/chat/editgroup",
          {
            chatId: user._id,
            chatName: chatName,
          },
          config
        );

        dispatch(chatActions.updateUserName(data.chatName));
        await fetchChats();
        setChatName(data.chatName);
        setEditName(false);
      } catch (error) {
        console.log("Error updating data:", error);
        setEditName(false);
      }
    } else {
      setEditName(false);
      return;
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    if (aboutText !== user.groupAbout) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentChat.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/chat/editgroup",
          {
            chatId: user._id,
            groupAbout: aboutText,
          },
          config
        );
        dispatch(chatActions.setSelectedChat(data));
        await fetchChats();
        setAboutText(data.groupAbout);
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      } catch (error) {
        console.log("Error updating data:", error);
      }
    }

    setEditAbout(false);
  };

  return (
    <div>
      {children && <span onClick={onOpen}>{children}</span>}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          sx={{
            background: "rgba(255, 255, 255, 0.600)",
            boxShadow: "0 4px 30px #4747470b",
            border: "3px solid rgba(255, 255, 255, 0.329)",
            backdropFilter: "blur(12px)",
            width: "90%",
          }}
        >
          <ModalHeader
            fontSize="25px"
            display="flex"
            justifyContent="center"
            textColor={"black"}
            bg={isLight ? "#475569" : "#24CEED"}
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
            borderTopRadius="0.3rem"
          >
            <span className="font-semibold text-sm flex gap-1">
              {user.isGroupChat &&
              user.groupAdmin.some(
                (admin) => admin.email === currentChat.email
              ) ? (
                editName ? (
                  <form
                    onSubmit={handleNameSubmit}
                    className="flex w-full justify-center items-end gap-1"
                  >
                    <input
                      ref={inputRef}
                      rows={1}
                      value={chatName}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          setChatName(e.target.value);
                        }
                      }}
                      className={`p-2 text-xl text-justify outline-primary rounded-md ${
                        !isLight
                          ? "bg-white text-black"
                          : "bg-slate-600 text-white"
                      }`}
                      maxLength={50}
                    />

                    <button
                      onMouseEnter={() => handleNameHover(true)}
                      onMouseLeave={() => handleNameHover(false)}
                      type="submit"
                    >
                      {editName ? (
                        nameHover ? (
                          <span className=" bg-primary rounded-md p-[2px] border-2 border-white">
                            Ok
                          </span>
                        ) : (
                          <span className=" font-normal flex bg-primary rounded-md p-[0.5px] border-2 border-white">
                            <p className="border-r-2 border-white bg-primary rounded-l-md p-[1px]">
                              {chatName.length}
                            </p>
                            <p className="border-l-2 border-white bg-primary rounded-r-md p-[1px]">
                              50
                            </p>
                          </span>
                        )
                      ) : (
                        <span className=" bg-primary rounded-md p-[1px] border-white">
                          <MdModeEdit />
                        </span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-end w-full gap-1">
                    <p className="text-xl bg-white backdrop-blur-sm p-2 rounded-md shadow-sm select-none">
                      {chatName || user.chatName || user.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditName(true)}
                      className=" bg-primary rounded-md p-[2.5px] hover:scale-105 border-2 border-white"
                    >
                      <MdModeEdit />
                    </button>
                  </div>
                )
              ) : (
                <p className="p-2 text-xl bg-white backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm select-none">
                  {user.chatName || user.name}
                </p>
              )}
            </span>
          </ModalHeader>
          <ModalCloseButton
            color={"white"}
            border={"2px solid white"}
            onClick={handleClose}
            marginRight={0}
          />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"center"}
            gap={"0.6rem"}
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
            sx={{
              backgroundImage: showAbout
                ? `linear-gradient(to bottom, ${
                    isLight ? "#475569" : "white"
                  } 25%, #24CEED 45%, #24CEED)`
                : "#24CEED",
            }}
          >
            <div className={`flex justify-between w-full `}>
              {user.isGroupChat && (
                <>
                  <span
                    className={`border-2 px-2 ${
                      user.isGroupChat
                        ? "w-[50%] rounded-l-md"
                        : "w-full rounded-md"
                    } flex justify-center cursor-pointer ${
                      isLight
                        ? showAbout
                          ? "bg-primary text-white border-white"
                          : "bg-slate-600 text-white border-white"
                        : showAbout
                        ? "bg-primary  text-white border-slate-600"
                        : "bg-white text-black border-slate-600"
                    }`}
                    onClick={() => setShowAbout(true)}
                  >
                    About
                  </span>
                  <span
                    onClick={() => setShowAbout(false)}
                    className={`border-2 px-2 rounded-r-md w-[50%] flex justify-center cursor-pointer ${
                      isLight
                        ? !showAbout
                          ? "bg-primary text-white border-white"
                          : "bg-slate-600 text-white border-white"
                        : !showAbout
                        ? "bg-primary text-white border-slate-600"
                        : "bg-white text-black border-slate-600"
                    }`}
                  >
                    Users
                  </span>
                </>
              )}
            </div>
            {showAbout ? (
              <>
                <span className="border-white border-4 rounded-full shadow-xl select-none">
                  <Image
                    borderRadius="full"
                    boxSize="13rem"
                    src={!user.isGroupChat ? user.profile : user.groupProfile}
                    draggable={false}
                    bg={"white"}
                  />
                </span>
                <div
                  className={`flex flex-col items-start ${
                    !isLight ? "bg-white text-black" : "bg-slate-600 text-white"
                  }  w-full p-2 rounded-lg gap-1`}
                >
                  <span className="text-md font-semibold  w-full">
                    {!user.isGroupChat ? (
                      <>
                        <span className="text-md font-bold select-none">
                          Email:{" "}
                        </span>
                        <span>{user.email}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold select-none">
                          Group Created by{" "}
                          <span className="font-bold">{user.createdBy}</span> on{" "}
                          {new Date(user.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </>
                    )}
                  </span>

                  <span className="text-sm font-semibold  w-full flex gap-1">
                    <span className="text-md font-bold select-none">
                      About:
                    </span>
                    {user.isGroupChat &&
                    user.groupAdmin.some(
                      (admin) => admin.email === currentChat.email
                    ) ? (
                      editAbout ? (
                        <form
                          onSubmit={handleAboutSubmit}
                          className="flex w-full items-end gap-1"
                        >
                          <textarea
                            ref={textareaRef}
                            rows={3}
                            value={aboutText}
                            onChange={(e) => {
                              if (e.target.value.length <= 190) {
                                setAboutText(e.target.value);
                              }
                            }}
                            className={`text-justify w-full resize-none focus:outline-none ${
                              editAbout ? "cursorToEnd" : ""
                            } ${
                              !isLight
                                ? "bg-white text-black"
                                : "bg-slate-600 text-white"
                            }`}
                            maxLength={190}
                          />

                          <button
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            type="submit"
                          >
                            {editAbout ? (
                              hover ? (
                                <span className=" bg-primary rounded-md p-[2px]">
                                  Ok
                                </span>
                              ) : (
                                <span className="flex flex-col bg-primary rounded-md p-[1px]">
                                  <p className="border-b-2 border-white bg-primary rounded-t-md p-[1px]">
                                    {aboutText.length}
                                  </p>
                                  <p className="border-t-2 border-white bg-primary rounded-b-md p-[1px]">
                                    190
                                  </p>
                                </span>
                              )
                            ) : (
                              <span className=" bg-primary rounded-md p-[1px]">
                                <MdModeEdit />
                              </span>
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-end w-full justify-between gap-1">
                          <p className="text-justify">
                            {aboutText || user.groupAbout || user.about}
                          </p>
                          <button
                            type="button"
                            onClick={() => setEditAbout(true)}
                            className=" bg-primary rounded-md p-[3px] hover:scale-105"
                          >
                            <MdModeEdit />
                          </button>
                        </div>
                      )
                    ) : (
                      <p className="text-justify">
                        {user.groupAbout || user.about}
                      </p>
                    )}
                  </span>
                  {!user.isGroupChat ? (
                    <span className="text-md font-semibold  w-full">
                      <span className="text-md font-bold select-none">
                        Phone:{" "}
                      </span>
                      {user.phone}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                {user.groupAdmin &&
                  user.groupAdmin.map((admin) => (
                    <React.Fragment key={admin.email}>
                      {currentChat.email === admin.email && (
                        <FormControl>
                          <div className="flex justify-center p-0 relative">
                            <Input
                              placeholder="Add users to group..."
                              onChange={(e) => handleSearch(e.target.value)}
                              bg={"white"}
                            />
                          </div>
                        </FormControl>
                      )}
                    </React.Fragment>
                  ))}

                {searchResult &&
                searchResult.length > 0 &&
                selectedUsers.length > 0 ? (
                  <div className="group relative w-full">
                    <div
                      className="flex flex-wrap w-full max-h-20 customScroll overflow-y-scroll border-2 rounded-md border-opacity-40 border-white"
                      ref={containerRef}
                    >
                      {selectedUsers.map((user) => (
                        <div key={user._id}>
                          <UserBadgeItem
                            user={user}
                            handleFunction={() => handleDelete(user)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute border-[0.05rem] border-primary bg-white rounded-md px-0.5 text-sm font-semibold right-0 bottom-0 opacity-100 transition-opacity duration-300 pointer-events-none group-hover:opacity-0">
                      {selectedUsers.length}{" "}
                      {selectedUsers.length > 1 ? "users" : "user"}
                    </div>
                  </div>
                ) : (
                  searchResult &&
                  searchResult.length > 0 && (
                    <span className="text-xl font-bold text-white">
                      {error && !loading ? (
                        <div>{error}</div>
                      ) : (
                        "No users added!😒"
                      )}
                    </span>
                  )
                )}
                {loading ? (
                  <div className="my-[6%] ml-[30%]">
                    <LoaderSpinner height="50%" width="50%" />
                  </div>
                ) : (
                  <>
                    {searchResult && searchResult.length > 0 ? (
                      <div className="w-full h-48 overflow-y-scroll border-2 rounded-md border-opacity-40 border-white">
                        {searchResult.map((user) => (
                          <div
                            className="m-2.5 flex flex-col"
                            key={user._id}
                            onClick={() => {
                              handleAddToGroup(user);
                            }}
                          >
                            <div
                              className={`w-full text-md font-semibold flex cursor-pointer items-center ${
                                selectedUsers.some(
                                  (selected) => selected._id === user._id
                                )
                                  ? isLight
                                    ? "bg-primary text-white"
                                    : "bg-primary text-white"
                                  : isLight
                                  ? "bg-slate-500 text-white"
                                  : "bg-gray-100 text-black hover:text-white"
                              } hover:bg-primaryLight rounded-md hover:scale-[102.5%]`}
                            >
                              <span className=" border-white rounded-full border-2 w-8.5 h-8.5 m-2">
                                <img
                                  src={user.profile}
                                  className="rounded-full w-8 h-8"
                                  alt={user.name}
                                />
                              </span>
                              <div>{user.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
                {selectedUsers.length > 0 && (
                  <span
                    className=" bg-primary border-2 border-white rounded-md p-1 text-white hover:scale-[102%] font-semibold cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Add to group
                  </span>
                )}

                {!loading &&
                searchResult &&
                searchResult.length < 1 &&
                user &&
                user.users.length > 0 ? (
                  <div className="w-full h-72 overflow-y-scroll border-2 rounded-md border-opacity-90 border-slate-400">
                    {user.users.some(
                      (userChat) =>
                        userChat.email === currentChat.email &&
                        !user.groupAdmin.some(
                          (admin) => admin.email === userChat.email
                        )
                    ) && (
                      <div className="m-2.5 flex flex-col">
                        <div className="flex justify-between items-center">
                          <div
                            className={`w-full text-md font-semibold flex items-center ${
                              !isLight
                                ? "bg-white text-black"
                                : "bg-slate-500 text-white"
                            } hover:bg-primaryLight hover:border-white border-2 rounded-md hover:scale-[102.5%]`}
                          >
                            <span className=" border-white rounded-full border-2 w-8.5 h-8.5 m-2">
                              <img
                                src={profilePicture}
                                className="rounded-full w-8 h-8"
                                alt={currentChat.name}
                              />
                            </span>

                            <div className="flex justify-between flex-auto items-center">
                              You
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.groupAdmin.map((admin) => (
                      <div className="m-2.5 flex flex-col" key={admin._id}>
                        <div className="flex justify-between items-center">
                          <div
                            className={`w-full text-md font-semibold flex items-center ${
                              !isLight
                                ? "bg-white text-black"
                                : "bg-slate-500 text-white"
                            } hover:bg-primaryLight hover:border-white border-2 rounded-md hover:scale-[102.5%]`}
                          >
                            <span className=" border-white rounded-full border-2 w-8.5 h-8.5 m-2">
                              {admin._id === currentChat.id ? (
                                <img
                                  src={admin.profile}
                                  className="rounded-full w-8 h-8"
                                  alt={admin.name}
                                />
                              ) : (
                                <UserProfileModal user={admin}>
                                  <img
                                    src={admin.profile}
                                    className="rounded-full w-8 h-8"
                                    alt={admin.name}
                                  />
                                </UserProfileModal>
                              )}
                            </span>
                            <div className="flex justify-between flex-auto items-center">
                              {currentChat.email === admin.email
                                ? "You"
                                : admin.name}
                              <span
                                className={`text-md font-bold mr-2 cursor-pointer hover:text-red-600 ${
                                  !isLight ? "text-green-600" : "text-green-400"
                                }`}
                                onMouseEnter={() =>
                                  setHoveredAdminId(admin._id)
                                }
                                onMouseLeave={() => setHoveredAdminId(null)}
                                onClick={() => {
                                  if (
                                    currentChat.email !== admin.email &&
                                    user.groupAdmin.some(
                                      (groupAdmin) =>
                                        groupAdmin.email === currentChat.email
                                    ) &&
                                    user.groupAdmin.some(
                                      (groupAdmin) =>
                                        groupAdmin.email === admin.email
                                    )
                                  ) {
                                    handleRemoveAdmin(admin._id);
                                  }
                                }}
                              >
                                {currentChat.email !== admin.email &&
                                user.groupAdmin.some(
                                  (groupAdmin) =>
                                    groupAdmin.email === currentChat.email
                                ) &&
                                hoveredAdminId === admin._id
                                  ? "Unadmin"
                                  : "Admin"}
                              </span>
                            </div>
                          </div>
                          {currentChat.email !== admin.email &&
                            user.groupAdmin.some(
                              (groupAdmin) =>
                                groupAdmin.email === currentChat.email
                            ) && (
                              <span
                                className="ml-2 rounded-md bg-white p-1 cursor-pointer hover:bg-primaryLight"
                                onClick={() => {
                                  handleRemoveAdmin(admin._id);
                                  handleRemoveFromgroup(admin);
                                }}
                              >
                                <StyledTooltip title={"Remove admin user"}>
                                  <MdPersonRemoveAlt1 />
                                </StyledTooltip>
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                    {user.users.map((userChat) => {
                      if (
                        !user.groupAdmin.some(
                          (admin) => admin._id === userChat._id
                        ) &&
                        currentChat.email !== userChat.email
                      ) {
                        return (
                          <div
                            className="m-2.5 flex flex-col"
                            key={userChat._id}
                          >
                            <div className="flex justify-between items-center">
                              <div
                                className={`w-full text-md font-semibold flex items-center ${
                                  !isLight
                                    ? "bg-white text-black"
                                    : "bg-slate-500 text-white"
                                } hover:bg-primaryLight hover:border-white border-2 rounded-md hover:scale-[102.5%]`}
                              >
                                <span className=" border-white rounded-full border-2 w-8.5 h-8.5 m-2">
                                  {userChat._id === currentChat.id ? (
                                    <img
                                      src={userChat.profile}
                                      className="rounded-full w-8 h-8"
                                      alt={userChat.name}
                                    />
                                  ) : (
                                    <UserProfileModal user={userChat}>
                                      <img
                                        src={userChat.profile}
                                        className="rounded-full w-8 h-8"
                                        alt={userChat.name}
                                      />
                                    </UserProfileModal>
                                  )}
                                </span>

                                <div className=" flex justify-between flex-auto items-center">
                                  {userChat.name}
                                  {user.groupAdmin.some(
                                    (admin) => admin.email === userChat.email
                                  ) ? (
                                    <span
                                      className={`text-md font-bold mr-2 cursor-pointer hover:text-red-600 ${
                                        !isLight
                                          ? "text-green-600"
                                          : "text-green-400"
                                      }`}
                                    >
                                      Admin
                                    </span>
                                  ) : user.groupAdmin.some(
                                      (admin) =>
                                        admin.email === currentChat.email
                                    ) ? (
                                    <span
                                      className={`text-sm font-normal mr-2 cursor-pointer border-2 p-[1px] rounded-md ${
                                        !isLight
                                          ? " border-slate-600 hover:bg-white"
                                          : "border-white hover:bg-white hover:text-black"
                                      }`}
                                      onClick={() =>
                                        handleMakeAdmin(userChat._id)
                                      }
                                    >
                                      Make admin
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              {user.groupAdmin.some(
                                (admin) => admin.email === currentChat.email
                              ) && (
                                <span
                                  className="ml-2 rounded-md bg-white p-1 cursor-pointer hover:bg-primaryLight"
                                  onClick={() =>
                                    handleRemoveFromgroup(userChat)
                                  }
                                >
                                  <StyledTooltip title={"Remove user"}>
                                    <MdPersonRemoveAlt1 />
                                  </StyledTooltip>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : null}
              </>
            )}
          </ModalBody>

          <ModalFooter
            display={"flex"}
            justifyContent={"space-between"}
            backgroundColor={`${!isLight ? "white" : "#475569"}`}
          >
            {user.isGroupChat ? (
              <>
                <button
                  onClick={handleBlock}
                  className="select-none w-[45%] bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
                >
                  Exit group
                </button>
                <button
                  onClick={handleClose}
                  className="select-none w-[45%] bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
                >
                  Report
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBlock}
                  className="select-none w-[45%] bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
                >
                  Block
                </button>
                <button
                  onClick={handleClose}
                  className="select-none w-[45%] bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
                >
                  Report
                </button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserProfileModal;
