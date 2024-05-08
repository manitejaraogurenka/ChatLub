import styles from "../../styles/Chat.module.css";
import { MdMessage, MdStarPurple500 } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { TbLivePhoto } from "react-icons/tb";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import { useSelector } from "react-redux";
import StyledTooltip from "../../helper/toolTip";
import ProfileModal from "./ProfileModal";

const Sidebar = () => {
  const isLight = useSelector((state) => state.lightDark.isLight);
  const user = useSelector((state) => state.chat.user);
  const profilePicture = useSelector((state) => state.chat.profilePicture);

  return (
    <div
      className={`flex flex-col justify-between items-center ${styles.chatBarGlass} w-12 h-[91%]`}
    >
      <div className="flex flex-col">
        <StyledTooltip title="Chats" placement="bottom">
          <div className={`${styles.sideBarIcons}`}>
            <MdMessage size={25} color={isLight ? "white" : "#2e2e2e"} />
          </div>
        </StyledTooltip>
        <StyledTooltip title="Calls" placement="top">
          <div className={`${styles.sideBarIcons}`}>
            <IoIosCall size={25} color={isLight ? "white" : "#2e2e2e"} />
          </div>
        </StyledTooltip>
        <StyledTooltip title="Status" placement="top">
          <div className={`${styles.sideBarIcons}`}>
            <TbLivePhoto size={25} color={isLight ? "white" : "#2e2e2e"} />
          </div>
        </StyledTooltip>
      </div>
      <div className="flex flex-col items-center">
        <StyledTooltip title="Favourites" placement="top">
          <div className={`${styles.sideBarIcons}`}>
            <MdStarPurple500 size={25} color={isLight ? "white" : "#2e2e2e"} />
          </div>
        </StyledTooltip>
        <StyledTooltip title="Archived" placement="top">
          <div className={`${styles.sideBarIcons}`}>
            <HiArchiveBoxArrowDown
              size={25}
              color={isLight ? "white" : "#2e2e2e"}
            />
          </div>
        </StyledTooltip>
        <ProfileModal user={user}>
          <div className={`${styles.sideBarProfile}`}>
            <img
              src={
                profilePicture ? profilePicture : "/assets/logo/profilePic.jpg"
              }
              className="rounded-full bg-white"
              alt={user.name}
            />
          </div>
        </ProfileModal>
      </div>
    </div>
  );
};

export default Sidebar;
