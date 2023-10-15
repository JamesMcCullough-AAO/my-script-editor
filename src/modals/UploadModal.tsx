import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { designColors } from "../utils/general/constants";
import { importScript } from "../utils/scriptManagement/importScript";
import { scriptSpacingTypes } from "../styling";

type UpdateModalProps = {
  isUploadModalOpen: boolean;
  onUploadModalClose: () => void;
  importText: string;
  setImportText: (importText: string) => void;
  contentRef: any;
  scriptSpacing: scriptSpacingTypes;
};

export const UploadModal = ({
  isUploadModalOpen,
  onUploadModalClose,
  importText,
  setImportText,
  contentRef,
  scriptSpacing,
}: UpdateModalProps) => {
  return (
    <Modal isOpen={isUploadModalOpen} onClose={onUploadModalClose}>
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Import/Export Script</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Paste your script here to import..."
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              importScript({ text: importText, contentRef, scriptSpacing });
              onUploadModalClose();
            }}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
