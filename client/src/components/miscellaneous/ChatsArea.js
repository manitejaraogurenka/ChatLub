import React from "react";
import styles from "../../styles/Chat.module.css";
import SingleChat from "./SingleChat";
const ChatsArea = () => {
  return (
    <div className=" flex flex-col flex-auto h-[91%]">
      <div className={`${styles.usersGlass} h-full w-full`}>
        <SingleChat />
      </div>
    </div>
  );
};

export default ChatsArea;
