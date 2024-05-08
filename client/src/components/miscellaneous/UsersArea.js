import { IoFilterCircleSharp } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoMdSearch } from "react-icons/io";
import styles from "../../styles/Chat.module.css";
import StyledTooltip from "../../helper/toolTip";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import LoaderSpinner from "../miscellaneous/Loader";
import { chatActions } from "../../store/chat-slice";
import MyChats from "./MyChats";
import GroupChatModal from "./groupChatModal";

const UsersArea = () => {
  const isLight = useSelector((state) => state.lightDark.isLight);
  const { user, chats } = useSelector((state) => state.chat);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const debouncedSearch = debounce(async (value) => {
    setLoading(true);
    if (value) {
      try {
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
        console.log(error);
        setSearchResult(null);
        setError("No results.");
        setLoading(false);
      }
    } else {
      debouncedSearch.cancel();
      setLoading(false);
      setSearchResult(null);
    }
  }, 300);

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    debouncedSearch(value);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c.email === data.email)) {
        dispatch(chatActions.setChats([data, ...chats]));
      }
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
      setError("No chats!.");
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      setSearchResult(null);
    };
  }, [error]);

  return (
    <div className="flex flex-col w-[30%] h-[91%]">
      <div className={`${styles.usersGlass}`}>
        <div className="flex justify-between p-2 items-center mx-1.5">
          <span
            className={`text-lg font-semibold ml-1 ${
              isLight ? "text-white" : "text-gray-800"
            }`}
          >
            Chats
          </span>
          <StyledTooltip title="Filter by">
            <span className=" text-white cursor-pointer">
              <IoFilterCircleSharp
                size={25}
                color={isLight ? "white" : "#2e2e2e"}
              />
            </span>
          </StyledTooltip>
        </div>
        <div className="flex p-2 justify-between items-center mx-1.5 gap-3">
          <div className="relative w-full">
            <span className="absolute mt-1.5 ml-1.5 rotate-90">
              <IoMdSearch size={20} color={"#2e2e2e"} />
            </span>
            <input
              placeholder="Search or start a new chat"
              className="rounded-lg p-1 pl-8 outline-none border-b-2 border-b-primary w-[95%] truncate"
              onChange={handleSearch}
            />
          </div>
          <StyledTooltip title="Create group">
            <span className=" text-white cursor-pointer">
              <GroupChatModal>
                <HiMiniUserGroup
                  size={24}
                  color={isLight ? "white" : "#2e2e2e"}
                />
              </GroupChatModal>
            </span>
          </StyledTooltip>
        </div>
      </div>
      <div className={`${styles.usersGlass} h-full overflow-y-scroll`}>
        {loading ? (
          <div className=" ml-[30%] mt-[30%]">
            <LoaderSpinner height="60%" width="60%" />
          </div>
        ) : error ? (
          <div className=" ml-[35%] mt-[40%] text-2xl font-bold text-white">
            {error}
          </div>
        ) : (
          <div className="w-full h-full">
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((user) => (
                <div
                  className="m-2.5 flex flex-col key={user._id}"
                  onClick={() => {
                    accessChat(user._id);
                    setSearchResult(null);
                  }}
                >
                  <div
                    className={`w-full text-md font-semibold flex cursor-pointer items-center ${
                      isLight
                        ? "bg-slate-500 text-white"
                        : " bg-gray-100 text-black hover:text-white"
                    } hover:bg-primaryLight hover:border-2 border-white rounded-md hover:scale-[102.5%]`}
                  >
                    <span className=" border-white rounded-full border-2 w-8.5 h-8.5 m-2">
                      <img
                        src={user.profile}
                        className="rounded-full w-8 h-8"
                        alt={user.name}
                      />
                    </span>

                    <div className="flex-1 truncate">{user.name}</div>
                  </div>
                </div>
              ))
            ) : !loadingChat ? (
              <div>
                <MyChats />
              </div>
            ) : (
              <div className=" ml-[30%] mt-[30%]">
                <LoaderSpinner height="60%" width="60%" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersArea;
