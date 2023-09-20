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

type UpdateModalProps = {
  isUploadModalOpen: boolean;
  onUploadModalClose: () => void;
  importText: string;
  setImportText: (importText: string) => void;
  importScript: (args: { text: string; contentRef: any }) => void;
  contentRef: any;
};

export const UploadModal = ({
  isUploadModalOpen,
  onUploadModalClose,
  importText,
  setImportText,
  importScript,
  contentRef,
}: UpdateModalProps) => {
  return (
    <Modal isOpen={isUploadModalOpen} onClose={onUploadModalClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#424242" color="white">
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
              importScript({ text: importText, contentRef });
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
