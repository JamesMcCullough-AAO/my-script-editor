import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  IconButton,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { TagIcon } from "../icons/TagIcon";
import { v4 } from "uuid";
import { designColors } from "../utils/general/constants";
import { compressImage } from "../utils/database/ImageCompressor";

type EditTagProps = {
  isOpen: boolean;
  onClose: () => void;
  tag?: { id: string; name: string; colour: string; image?: string }; // Optional tag for editing
  onSave: (tag: {
    id: string;
    name: string;
    colour: string;
    image?: string;
  }) => void; // Function to save the tag
};

const ColorIconButton = ({
  color,
  onSelectColor,
  isSelected,
}: {
  color: string;
  onSelectColor: (color: string) => void;
  isSelected: boolean;
}) => {
  return (
    <IconButton
      colorScheme="grey"
      aria-label="Update icon"
      icon={<TagIcon color={color} width="40px" />}
      backgroundColor={isSelected ? "blackAlpha.600" : "blackAlpha.200"}
      _hover={{
        backgroundColor: "blackAlpha.600",
        cursor: "pointer",
      }}
      onClick={() => onSelectColor(color)}
    />
  );
};

export const EditTag = ({ isOpen, onClose, tag, onSave }: EditTagProps) => {
  const [tagName, setTagName] = useState(tag ? tag.name : "");
  const [tagColor, setTagColor] = useState(tag ? tag.colour : "");
  const [tagIcon, setTagIcon] = useState(tag && tag.image ? tag.image : "");

  const handleSave = () => {
    onSave({
      id: tag ? tag.id : v4(),
      name: tagName,
      colour: tagColor,
      image: tagIcon,
    }); // Generate UUID for new tag
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setTagColor(color);
  };

  const handleUploadIcon = async (event: any) => {
    const uploadedImage = event.target.files[0];
    const compressedImage = await compressImage(uploadedImage);
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);
    reader.onloadend = () => {
      setTagIcon(reader.result as string);
    };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>{tag ? "Edit Tag" : "Create Tag"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="2">Tag Name:</Text>
          <Input
            placeholder="Enter tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            mb="4"
          />

          <Text>Choose a color:</Text>
          {/* Color selection rows */}
          {[
            ["#00FFB6", "#00C8FF", "#008DFF", "#FF00F1", "#FF004E", "#FF0000"],
            ["#FF8B00", "#FFDC00", "#C7FF00", "#00FF0E", "#FFFFFF", "#939393"],
          ].map((row, index) => (
            <HStack key={index} spacing="2" mb="2" justifyContent="center">
              {row.map((color) => (
                <ColorIconButton
                  key={color}
                  color={color}
                  onSelectColor={handleColorSelect}
                  isSelected={tagColor === color}
                />
              ))}
            </HStack>
          ))}
          <Text mb="2">Or, upload your own icon:</Text>
          <input type="file" onChange={handleUploadIcon} />
          {tagIcon && (
            <Image
              src={tagIcon}
              alt="Tag Icon"
              boxSize="50px"
              borderRadius="0.25em"
              border="1px solid #ccc"
              _hover={{
                cursor: "pointer",
                border: "2px solid #FF0000",
              }}
              onClick={() => {
                setTagIcon("");
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
