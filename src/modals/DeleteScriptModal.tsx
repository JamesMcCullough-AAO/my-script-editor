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
import React from "react";
import { designColors } from "../utils/general/constants";
import { addExternalLinkSpan } from "../utils/general/createLinkFromSelection";
import { deleteScript } from "../utils/scriptManagement/deleteScript";

type DeleteScriptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const DeleteScriptModal = ({
  isOpen,
  onClose,
  title,
  contentRef,
  setTitle,
}: DeleteScriptModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this script?</ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              deleteScript({
                title,
                contentRef,
                setTitle,
              });
              onClose();
            }}
          >
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
