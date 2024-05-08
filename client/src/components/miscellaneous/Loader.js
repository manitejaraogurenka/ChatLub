import React from "react";
import { Circles } from "react-loader-spinner";
import styles from "../../styles/Loaderspinner.module.css";
import { useSelector } from "react-redux";

function LoaderSpinner({ height, width }) {
  const isLight = useSelector((state) => state.lightDark.isLight);
  return (
    <div className={styles.loader_container}>
      <Circles
        height={height}
        width={width}
        color={isLight ? "#24CEED" : "#ffffff"}
        visible={true}
      />
    </div>
  );
}

export default LoaderSpinner;
