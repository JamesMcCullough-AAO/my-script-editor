import {
  Button,
  HStack,
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
import { baseIconColor, designColors } from "../utils/general/constants";
import { LinkIcon } from "../icons/linkIcon";

type ShareSuccessModalProps = {
  scriptShareLink: string;
  setScriptShareLink: React.Dispatch<React.SetStateAction<string>>;
};

export const ShareSuccessModal = ({
  scriptShareLink,
  setScriptShareLink,
}: ShareSuccessModalProps) => {
  return (
    <Modal
      isOpen={scriptShareLink !== ""}
      onClose={() => setScriptShareLink("")}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Share Success!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Your script is now available at the following link. It has also been
            copied to your clipboard.
          </Text>
          <HStack
            paddingTop="4"
            paddingBottom="4"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <LinkIcon color={baseIconColor} width="40px" />
            <Input
              value={scriptShareLink}
              isReadOnly
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(scriptShareLink);
              }}
            />
          </HStack>
          <Text>
            This is a static link, and changes in the script will not be
            reflected in the link. To update the link, click the share button
            again.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setScriptShareLink("")}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
