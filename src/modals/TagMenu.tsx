import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  ListItem,
  List,
  Box,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { designColors } from "../utils/general/constants";
import { EditTag } from "./EditTag";
import EditIcon from "@mui/icons-material/Edit";
import { TagIcon } from "../icons/TagIcon";
import { v4 } from "uuid";
import { getAllTags, setTag } from "../utils/database/indexDB";

export type ScriptTag = {
  id: string;
  name: string;
  colour: string;
  image?: string;
};

type TagMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  scriptTags: string[]; // IDs of tags added to the current script
  setScriptTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const TagButton = ({
  color,
  image,
  onSelectTag,
  isSelected,
  tag,
}: {
  color: string;
  image?: string;
  onSelectTag: (tag: string) => void;
  isSelected: boolean;
  tag: string;
}) => {
  return image ? (
    <Image
      src={image}
      alt={tag}
      boxSize="40px"
      onClick={() => {
        onSelectTag(tag);
      }}
      borderRadius="0.25em"
      border="1px solid #ccc"
      _hover={{
        cursor: "pointer",
        border: "1px solid #FF0000",
      }}
    />
  ) : (
    <IconButton
      colorScheme="grey"
      aria-label="Update icon"
      icon={<TagIcon color={color} width="40px" />}
      backgroundColor={isSelected ? "blackAlpha.600" : "blackAlpha.200"}
      _hover={{
        backgroundColor: "darkred",
        cursor: "pointer",
      }}
      onClick={() => onSelectTag(tag)}
    />
  );
};

export const TagMenu = ({
  isOpen,
  onClose,
  scriptTags,
  setScriptTags,
}: TagMenuProps) => {
  const [globalScriptTags, setGlobalScriptTags] = useState<ScriptTag[]>([]);
  const [editingTag, setEditingTag] = useState<ScriptTag | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const loadedTags = await getAllTags();
        // Sort by image first, then name
        loadedTags.sort((a, b) => {
          if (a.image && !b.image) {
            return -1;
          } else if (!a.image && b.image) {
            return 1;
          } else {
            return a.name.localeCompare(b.name);
          }
        });

        setGlobalScriptTags(loadedTags);
      } catch (error) {
        console.error("Failed to load tags from database:", error);
      }
    };

    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const removeTagFromScript = (tagId: string) => {
    setScriptTags((prev) => prev.filter((id) => id !== tagId));
  };

  const openEditModal = (tag: ScriptTag) => {
    setEditingTag(tag);
  };

  const handleSaveTag = async (tag: ScriptTag) => {
    try {
      await setTag(`tag_${tag.id}`, tag); // Save to the database
      // Update or add the tag in the scriptTags array
      setGlobalScriptTags((prevTags) => {
        const existingTagIndex = prevTags.findIndex((t) => t.id === tag.id);
        if (existingTagIndex > -1) {
          // Update existing tag
          const updatedTags = [...prevTags];
          updatedTags[existingTagIndex] = tag;
          return updatedTags;
        } else {
          // Add new tag
          return [...prevTags, tag];
        }
      });
    } catch (error) {
      console.error("Failed to save tag to database:", error);
    }
    setEditingTag(null); // Close the edit modal
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent
          backgroundColor={designColors.backgroundgray}
          color="white"
        >
          <ModalHeader>Tag Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={4} mb={4}>
              {scriptTags.map((tagId) => {
                const tag = globalScriptTags.find((t) => t.id === tagId);
                return tag ? (
                  <TagButton
                    color={tag.colour}
                    onSelectTag={() => {
                      removeTagFromScript(tag.id);
                    }}
                    isSelected={false}
                    tag={tag.id}
                    image={tag.image}
                  />
                ) : null;
              })}
            </HStack>
            <List width="100%" spacing="1">
              {globalScriptTags.map((tag) => (
                <ListItem
                  key={tag.id}
                  border="1px solid #ccc"
                  borderRadius="0.25em"
                  backgroundColor={designColors.darkblue}
                  padding="0.5em"
                  _hover={{
                    backgroundColor: "#007050",
                    cursor: "pointer",
                  }}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <HStack
                    onClick={() => {
                      // if it's not in the script tags, add it
                      if (!scriptTags.includes(tag.id)) {
                        setScriptTags((prev) => [...prev, tag.id]);
                      } else {
                        removeTagFromScript(tag.id);
                      }
                    }}
                    width="100%"
                  >
                    {tag.image ? (
                      <Image
                        src={tag.image}
                        alt={tag.name}
                        boxSize="40px"
                        borderRadius="0.25em"
                        border="1px solid #ccc"
                      />
                    ) : (
                      <TagIcon color={tag.colour} width="40px" />
                    )}
                    <Text paddingLeft={3}>{tag.name}</Text>
                  </HStack>
                  <IconButton
                    aria-label="Edit tag"
                    icon={<EditIcon />}
                    onClick={() => openEditModal(tag)}
                    alignSelf={"flex-end"}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              colorScheme="blue"
              mt="4"
              onClick={() => openEditModal({ id: v4(), name: "", colour: "" })}
            >
              Create New Tag
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {editingTag && (
        <EditTag
          isOpen={!!editingTag}
          onClose={() => setEditingTag(null)}
          tag={editingTag}
          onSave={handleSaveTag}
        />
      )}
    </>
  );
};
