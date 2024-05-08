import React, { useEffect, useRef, useState } from "react";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  ModalFooter,
  useDisclosure,
  FormControl,
  Input,
} from "@chakra-ui/react";
import styles from "../../styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import axios from "axios";
import LoaderSpinner from "./Loader";
import { toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import UserBadgeItem from "../../helper/userBadge";
import { chatActions } from "../../store/chat-slice";
import { BiLoaderCircle, BiSolidMessageSquareEdit } from "react-icons/bi";
import GroupChatProfile from "../../statics/GroupChatProfile.png";
import { resizeImage } from "../../helper/convert";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isLight = useSelector((state) => state.lightDark.isLight);
  const { user, chats } = useSelector((state) => state.chat);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState();
  const dispatch = useDispatch();

  const debouncedSearch = debounce(async (value) => {
    if (value) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `/api/user/users?search=${value}`,
          config
        );

        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        setSearchResult(null);
        setError("No results.");
        console.log(error);
        setLoading(false);
      }
    } else {
      debouncedSearch.cancel();
      setLoading(false);
      setSearchResult(null);
    }
  }, 300);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      setSearchResult(null);
    };
  }, [error]);

  const handleSearch = (query) => {
    let value = query.trim();
    debouncedSearch(value);
  };

  const handleSubmit = async () => {
    if (!groupChatName) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Group name required!</b>
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
    if (!selectedUsers || selectedUsers.length < 2) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Minimum 2 users required!</b>
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
    try {
      setCreateGroupLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/creategroup",
        {
          name: groupChatName,
          groupProfile: profile ? profile : GroupChatProfile,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      toast.success("Group created successfully!");
      onClose();
      setProfile(null);
      setSelectedUsers([]);
      setGroupChatName("");
      setSearchResult([]);
      setCreateGroupLoading(false);
      dispatch(chatActions.setChats([...chats, data]));
    } catch (error) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>Failed to create group!</b>
            <button onClick={() => toast.dismiss(t.id)}>
              <AiFillCloseCircle color="red" size={23} />
            </button>
          </span>
        ),
        {
          duration: 3000,
        }
      );
      setCreateGroupLoading(false);
    }
  };

  const handleDelete = (userTodelete) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== userTodelete._id)
    );
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

  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUsers]);

  useEffect(() => {
    dispatch(chatActions.setModalOpen(isOpen));
    // eslint-disable-next-line
  }, [isOpen]);

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size here
    if (file.size > 5 * 1024 * 1024) {
      toast(
        (t) => (
          <span className="flex items-center gap-1">
            <b>File size should be less than 5MB</b>
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

    try {
      const uri = await resizeImage(file);
      setProfile(uri);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  return (
    <div>
      {children ? <span onClick={onOpen}>{children}</span> : ""}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setProfile(null);
          setSelectedUsers([]);
          setSearchResult([]);
          setGroupChatName("");
        }}
        isCentered
      >
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
            bg={isLight ? "#64748B" : "#24CEED"}
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
            borderTopRadius="0.3rem"
          >
            <span className=" bg-white backdrop-blur-sm p-1.5 rounded-md shadow-sm select-none font-semibold">
              New group
            </span>
          </ModalHeader>
          <ModalCloseButton color={"white"} border={"2px solid white"} />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"center"}
            gap={"1rem"}
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
          >
            <FormControl>
              <div className="flex justify-center mt-0.5 mb-2.5 p-0 relative">
                <label htmlFor="profile">
                  <span className="absolute ml-[4.5rem] mt-14">
                    <BiSolidMessageSquareEdit
                      color="#1f1f1f"
                      size={30}
                      className="cursor-pointer"
                    />
                  </span>
                  <img
                    src={profile || GroupChatProfile}
                    className={styles.profile_img}
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                  accept="image/jpeg,image/jpg,image/png"
                />
              </div>
              <Input
                placeholder="Group name"
                mb={2}
                onChange={(e) => setGroupChatName(e.target.value)}
                bg={"white"}
              />
              <Input
                placeholder="Add users..."
                onChange={(e) => handleSearch(e.target.value)}
                bg={"white"}
              />
            </FormControl>

            {selectedUsers.length > 0 ? (
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
              <span className="text-xl font-bold text-white">
                {error && !loading ? <div>{error}</div> : "No users added!😒"}
              </span>
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
          </ModalBody>

          <ModalFooter>
            <button
              onClick={handleSubmit}
              disabled={createGroupLoading}
              className=" bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
            >
              {createGroupLoading ? (
                <span className="flex items-center justify-center gap-1">
                  <BiLoaderCircle
                    size={25}
                    style={{
                      color: "#ffffff",
                    }}
                    className={styles.spin}
                  />
                  Creating group...
                </span>
              ) : (
                "Create group"
              )}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
