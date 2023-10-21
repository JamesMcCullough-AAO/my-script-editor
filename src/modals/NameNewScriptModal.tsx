import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { designColors } from "../utils/general/constants";
import { newScript } from "../utils/scriptManagement/newScript";

type NameNewScriptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  contentRef: React.RefObject<HTMLDivElement>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  setIconColor: React.Dispatch<React.SetStateAction<string>>;
  setScriptUUID: React.Dispatch<React.SetStateAction<string>>;
};

export const NameNewScriptModal = ({
  isOpen,
  onClose,
  setTitle,
  contentRef,
  setNotes,
  setIconImage,
  setIconColor,
  setScriptUUID,
}: NameNewScriptModalProps) => {
  const [newScriptTitle, setNewScriptTitle] = useState("");

  React.useEffect(() => {
    setNewScriptTitle("");
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Name New Script</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={newScriptTitle}
            onChange={(e) => setNewScriptTitle(e.target.value)}
            placeholder="New Script Title"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              newScript({
                newScriptTitle,
                contentRef,
                setTitle,
                setNotes,
                setIconImage,
                setIconColor,
                setScriptUUID,
              });
              onClose();
            }}
          >
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
