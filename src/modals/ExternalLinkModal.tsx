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

type ExternalLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  savedRange: Range | undefined;
  setSavedRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
};

export const ExternalLinkModal = ({
  isOpen,
  onClose,
  savedRange,
  setSavedRange,
}: ExternalLinkModalProps) => {
  const [externalLinkUrl, setExternalLinkUrl] = React.useState("");
  const [externalLinkName, setExternalLinkName] = React.useState("");

  const handleSubmitURL = () => {
    if (!savedRange) return;
    addExternalLinkSpan(externalLinkUrl, externalLinkName, savedRange);
    setSavedRange(undefined);
    setExternalLinkUrl("");
    setExternalLinkName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>External Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Enter the URL:</Text>
          <Input
            value={externalLinkUrl}
            onChange={(e) => setExternalLinkUrl(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                document.getElementById("externalLinkName")?.focus();
              }
            }}
          />
          <Text>Enter the name:</Text>
          <Input
            id="externalLinkName"
            value={externalLinkName}
            onChange={(e) => setExternalLinkName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitURL();
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              handleSubmitURL();
            }}
          >
            Add
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
