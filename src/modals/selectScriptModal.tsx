import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SelectScript } from "../components/selectScript";
import { designColors } from "../utils/general/constants";

type SelectScriptModalProps = {
  isSelectScriptModalOpen: boolean;
  onSelectScriptModalClose: () => void;
  title: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (title: string) => void;
};

export const SelectScriptModal = ({
  isSelectScriptModalOpen,
  onSelectScriptModalClose,
  title,
  setIsLoading,
  onSelect,
}: SelectScriptModalProps) => {
  // A chakra modal that uses the selectScript component.
  return (
    <Modal
      isOpen={isSelectScriptModalOpen}
      onClose={onSelectScriptModalClose}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Which Script do you want to Link?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SelectScript
            title={title}
            onSelect={onSelect}
            setIsLoading={setIsLoading}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
