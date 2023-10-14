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

type NotesModalProps = {
  isNotesModalOpen: boolean;
  onNotesModalClose: () => void;
  notes: string;
  setNotes: (notes: string) => void;
};

export const NotesModal = ({
  isNotesModalOpen,
  onNotesModalClose,
  notes,
  setNotes,
}: NotesModalProps) => {
  return (
    <Modal isOpen={isNotesModalOpen} onClose={onNotesModalClose} size="4xl">
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Notes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Notes..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            height="50vh"
            autoFocus
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onNotesModalClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
