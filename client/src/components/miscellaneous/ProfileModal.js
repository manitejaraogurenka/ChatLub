import React, { useEffect, useRef, useState } from "react";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalFooter,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { chatActions } from "../../store/chat-slice";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { resizeImage } from "../../helper/convert";
import toast from "react-hot-toast";
import { MdModeEdit } from "react-icons/md";
import { editUser } from "../../helper/helper";

const ProfileModal = ({ user, children }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState();
  const [editAbout, setEditAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [editName, setEditName] = useState(false);
  const [userName, setUserName] = useState();
  const [hover, setHover] = useState(false);

  const [nameHover, setNameHover] = useState(false);
  const profilePicture = useSelector((state) => state.chat.profilePicture);
  const isLight = useSelector((state) => state.lightDark.isLight);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const textareaRef = useRef(null);
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
    handleEditProfile(profile);
    // eslint-disable-next-line
  }, [profile]);

  useEffect(() => {
    setUserName(user.name);
  }, [user.name]);
  useEffect(() => {
    setAboutText(user.about);
  }, [user.about]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(chatActions.setUser(""));
    dispatch(chatActions.setSelectedChat(""));
    setAboutText("");
    setUserName("");
    onClose();
    navigate("/");
  };

  const handleClose = () => {
    setEditAbout(false);
    setEditName(false);
    setAboutText(aboutText || user.about);
    setUserName(userName || user.name);
    onClose();
  };

  const handleNameHover = (isHovering) => {
    setNameHover(isHovering);
  };

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size here
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      const uri = await resizeImage(file);
      setProfile(uri);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  const handleEditName = async (e) => {
    e.preventDefault();
    if (userName === user.name) {
      setEditName(false);
      setUserName("");
      return;
    }
    let editNamePromise = editUser({ user, field: "name", value: userName });

    editNamePromise
      .then((result) => {
        if (result) {
          setUserName(result.name);
          dispatch(chatActions.setUser({ ...user, name: result.name }));
          setEditName(false);
        }
      })
      .catch((error) => {
        console.log("Error updating data:", error);
        setEditName(false);
      });
  };

  const handleEditProfile = async () => {
    if (profile === user.profile) {
      setProfile(user.profile);
      return;
    }
    let editProfilePromise = editUser({
      user,
      field: "profile",
      value: profile,
    });
    editProfilePromise
      .then((result) => {
        if (result) {
          dispatch(chatActions.setUser({ ...user, profile: result.profile }));
          dispatch(chatActions.setProfilePicture(result.profile));
          let userData = JSON.parse(localStorage.getItem("userLoginInfo"));
          userData.profile = result.profile;
          localStorage.setItem("userLoginInfo", JSON.stringify(userData));
        }
      })
      .catch((error) => {
        console.log("Error updating data:", error);
        setProfile(user.profile);
      });
  };

  const handleEditAbout = async (e) => {
    e.preventDefault();
    if (aboutText === user.about) {
      setEditAbout(false);
      return;
    }
    let editAboutPromise = editUser({ user, field: "about", value: aboutText });
    editAboutPromise
      .then((result) => {
        if (result) {
          dispatch(chatActions.setUser({ ...user, about: result.about }));
          setEditAbout(false);
        }
      })
      .catch((error) => {
        console.log("Error updating data:", error);
        setEditAbout(false);
      });
  };

  return (
    <div>
      {children ? <span onClick={onOpen}>{children}</span> : ""}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
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
            bg={isLight ? "#2B2B2B" : "#24CEED"}
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
            borderTopRadius="0.3rem"
          >
            <span className="font-semibold text-sm flex gap-1">
              {editName ? (
                <form
                  onSubmit={handleEditName}
                  className="flex w-full justify-center items-end gap-1"
                >
                  <input
                    ref={inputRef}
                    rows={1}
                    value={userName}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setUserName(e.target.value);
                      }
                    }}
                    className={`p-2 text-xl text-justify outline-primary rounded-md ${
                      !isLight
                        ? "bg-white text-slate-700"
                        : "bg-black text-white"
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
                            {userName.length}
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
                    {userName || user.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditName(true)}
                    className=" bg-primary rounded-md p-[2.5px] hover:scale-105 border-2 border-white"
                  >
                    <MdModeEdit />
                  </button>
                </div>
              )}
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
            sx={{
              backgroundImage: `linear-gradient(to bottom, ${
                isLight ? "#2b2b2b" : "white"
              } 25%, #24CEED 45%, #24CEED)`,
            }}
          >
            <span className="border-primary border-4 rounded-full shadow-lg select-none">
              <div className="flex justify-center p-0 relative">
                <label htmlFor="profile">
                  <span className="absolute ml-[13.5rem] mt-48 bg-white rounded-t-xl rounded-br-xl">
                    <BiSolidMessageSquareEdit
                      color="#1f1f1f"
                      size={30}
                      className="cursor-pointer"
                    />
                  </span>
                </label>
                <img
                  src={profile || profilePicture}
                  className="bg-white rounded-full shadow-xl m-0 p-0 hover:border-gray-200 w-[16rem] h-[16rem]"
                  draggable={false}
                  alt="avatar"
                />
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                  accept="image/jpeg,image/jpg,image/png"
                />
              </div>
            </span>
            <div
              className={`flex flex-col items-start ${
                !isLight ? "bg-white text-black" : "bg-slate-600 text-white"
              }  w-full p-2 rounded-lg gap-1`}
            >
              <span className="text-md font-semibold w-full">
                <span className="text-md font-bold select-none">Email: </span>
                {user.email}
              </span>
              <span className="text-sm font-semibold  w-full flex gap-1">
                <span className="text-md font-bold select-none">About:</span>
                {editAbout ? (
                  <form
                    onSubmit={handleEditAbout}
                    className="flex w-full items-end gap-1"
                  >
                    <textarea
                      ref={textareaRef}
                      rows={3}
                      value={aboutText}
                      onChange={(e) => {
                        if (e.target.value.length <= 150) {
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
                      maxLength={150}
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
                              150
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
                    <p className="text-justify">{aboutText || user.about}</p>
                    <button
                      type="button"
                      onClick={() => setEditAbout(true)}
                      className=" bg-primary rounded-md p-[3px] hover:scale-105"
                    >
                      <MdModeEdit />
                    </button>
                  </div>
                )}
              </span>
              <span className="text-md font-semibold w-full">
                <span className="text-md font-bold select-none">Phone: </span>
                {user.phone || "+91 1234567890"}
              </span>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              onClick={handleLogout}
              className=" bg-primary p-2 hover:scale-105 active:scale-100 rounded-lg text-white font-semibold border-2 border-white transition-all duration-300"
            >
              Logout
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
