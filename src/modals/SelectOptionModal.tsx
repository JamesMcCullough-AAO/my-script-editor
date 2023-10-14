import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { darkIconColor, designColors } from "../utils/general/constants";

type SelectOptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  onSelectOption: (option: string) => void;
};

const SelectOptionModal = ({
  isOpen,
  onClose,
  options,
  onSelectOption,
}: SelectOptionModalProps) => {
  const [searchText, setSearchText] = useState("");
  const [hoveredOption, setHoveredOption] = useState(0);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectOption = (option: string) => {
    onSelectOption(option);
    setSearchText("");
    setHoveredOption(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Select an Option</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus // Auto-select the search bar
            // if they press enter, select the hovered option
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (filteredOptions.length > 0)
                  handleSelectOption(filteredOptions[hoveredOption]);
              }
            }}
            // if they press up/down, change the hovered option
            onKeyUp={(e) => {
              if (e.key === "ArrowDown") {
                setHoveredOption((hoveredOption + 1) % filteredOptions.length);
              } else if (e.key === "ArrowUp") {
                setHoveredOption(
                  hoveredOption === 0
                    ? filteredOptions.length - 1
                    : hoveredOption - 1
                );
              }
            }}
          />
          <List mt={4}>
            {filteredOptions.map((option, index) => (
              <ListItem
                key={option}
                cursor="pointer"
                onClick={() => handleSelectOption(option)}
                // Hilight the hovered item
                onMouseEnter={() => setHoveredOption(options.indexOf(option))}
                onMouseLeave={() => setHoveredOption(0)}
                backgroundColor={
                  index === hoveredOption
                    ? darkIconColor
                    : designColors.darkblue
                }
                padding={2}
                borderRadius="0.25em"
                border="1px solid #ccc"
              >
                {option}
              </ListItem>
            ))}
          </List>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectOptionModal;
