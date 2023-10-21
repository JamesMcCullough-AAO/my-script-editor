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
import { addExternalLinkSpan } from "../utils/general/createLinkFromSelection";
import { deleteScript } from "../utils/scriptManagement/deleteScript";
import { handleRenameScript } from "../handlers/handleRenameScript";

type RenameScriptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
};

export const RenameScriptModal = ({
  isOpen,
  onClose,
  setTitle,
  title,
}: RenameScriptModalProps) => {
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [oldScriptTitle, setOldScriptTitle] = useState("");

  React.useEffect(() => {
    setNewScriptTitle(title);
    setOldScriptTitle(title);
  }, [title, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Rename Script</ModalHeader>
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
            onClick={async () => {
              const canClose = await handleRenameScript({
                oldScriptTitle,
                newScriptTitle,
                setTitle,
              });
              if (canClose) onClose();
            }}
          >
            Rename
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
