import { Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CustomTooltip = ({ title, children, placement = "right-start" }) => {
  const isLight = useSelector((state) => state.lightDark.isLight);
  const isModalOpen = useSelector((state) => state.chat.isModalOpen);
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId;

  const handleOpen = () => {
    if (!isModalOpen) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsOpen(true);
      }, 700);
    }
  };

  const handleClose = () => {
    clearTimeout(timeoutId);
    setIsOpen(false);
  };

  useEffect(() => {
    handleClose();
    // eslint-disable-next-line
  }, [isModalOpen]);

  return (
    <Tooltip
      label={title}
      hasArrow
      placement={placement}
      isOpen={!isModalOpen && isOpen}
      onClose={handleClose}
      bg={isLight ? "white" : "#3d3d3d"}
      color={isLight ? "#3d3d3d" : "white"}
      borderRadius={"0.5rem"}
      arrowSize={9}
      disabled={isModalOpen}
    >
      <span
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onBlur={handleClose}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default CustomTooltip;
