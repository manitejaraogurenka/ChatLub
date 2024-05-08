import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Modal,
} from "@chakra-ui/react";

const ProfilePicModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : null}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          sx={{
            border: "3px solid rgba(255, 255, 255, 0.329)",
            backdropFilter: "blur(12px)",
            width: "90%",
          }}
        >
          <ModalCloseButton color={"white"} border={"2px solid white"} />
          <ModalBody
            borderBottom={"4px solid rgba(255, 255, 255, 0.329)"}
            width={"50px"}
            height={"50px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <img
              src={user.profile || user.groupProfile}
              alt={user.name}
              width={"40px"}
              height={"40px"}
              className="rounded-full"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePicModal;
