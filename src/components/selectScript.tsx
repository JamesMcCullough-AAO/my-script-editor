import {
  HStack,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DocumentIcon } from "../icons/DocumentIcon";
import { baseIconColor, designColors } from "../utils/general/constants";
import { formatTimestamp } from "../utils/general/formatTimestamp";
import { searchSavedTitles } from "../utils/scriptManagement/searchSavedTitles";
import { TagIcon } from "../icons/TagIcon";
import { getAllTags } from "../utils/database/indexDB";
import { ScriptTag } from "../modals/TagMenu";

type SelectScriptProps = {
  title: string;
  onSelect: (title: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleTagButton = ({
  color,
  image,
  tag,
  onSelectTag,
  isSelected,
  tagName,
}: {
  color: string;
  image?: string;
  onSelectTag: (tag: string) => void;
  isSelected: boolean;
  tag: string;
  tagName: string;
}) => {
  return image ? (
    <Image
      src={image}
      alt={tag}
      title={tagName}
      boxSize="40px"
      onClick={() => {
        onSelectTag(tag);
      }}
      borderRadius="0.25em"
      border={isSelected ? "4px solid #000000" : "1px solid #ccc"}
      _hover={{
        cursor: "pointer",
        border: "4px solid #000000",
      }}
    />
  ) : (
    <IconButton
      colorScheme="grey"
      aria-label="Update icon"
      title={tagName}
      icon={<TagIcon color={color} width="40px" />}
      backgroundColor={isSelected ? "blackAlpha.600" : "blackAlpha.200"}
      _hover={{
        backgroundColor: "blackAlpha.600",
        cursor: "pointer",
      }}
      onClick={() => onSelectTag(tag)}
    />
  );
};

export const SelectScript = ({
  title,
  onSelect,
  setIsLoading,
}: SelectScriptProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedScriptTitles, setSavedScriptTitles] = useState([
    {
      title: "",
      timestamp: 0,
      iconColor: baseIconColor,
    },
  ] as {
    title: string;
    timestamp: number;
    iconImage?: string;
    notes?: string;
    iconColor: string;
  }[]);
  const [allTags, setAllTags] = useState<ScriptTag[]>([]); // State to store all tags
  const [selectedTags, setSelectedTags] = useState(new Set<string>()); // State to track selected tags

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      setIsLoading(true);
      try {
        const updatedScriptTitles = await searchSavedTitles({
          title,
          searchTerm,
          selectedTags: Array.from(selectedTags),
        });
        setSavedScriptTitles(updatedScriptTitles);
      } catch (error) {
        // Handle the error appropriately.
        console.error("An error occurred while fetching titles:", error);
      }
      setIsLoading(false);
    };

    fetchTitles();
  }, [searchTerm, selectedTags]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prevSelectedTags) => {
      const newTags = new Set(prevSelectedTags);
      if (newTags.has(tagId)) {
        newTags.delete(tagId);
      } else {
        newTags.add(tagId);
      }
      return newTags;
    });
  };

  return (
    <>
      {savedScriptTitles.length === 0 &&
        searchTerm.length == 0 &&
        selectedTags.size === 0 && <Text>No saved scripts yet!</Text>}
      {(savedScriptTitles.length > 0 ||
        searchTerm.length > 0 ||
        selectedTags.size > 0) && (
        <VStack flex="1" width="100%">
          <Text>Saved Scripts</Text>
          <Input
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            autoFocus // Auto-select the search bar
          />
          <HStack spacing="2">
            {allTags.map((tag) => (
              <ToggleTagButton
                key={tag.id}
                color={tag.colour}
                image={tag.image}
                tagName={tag.name}
                tag={tag.id}
                onSelectTag={toggleTag}
                isSelected={selectedTags.has(tag.id)}
              />
            ))}
          </HStack>
          <List width="100%" spacing="1">
            {savedScriptTitles.map((script) => (
              <ListItem
                border="1px solid #ccc"
                borderRadius="0.25em"
                backgroundColor={designColors.darkblue}
                padding="0.5em"
                key={script.title}
                onClick={async () => {
                  onSelect(script.title);
                }}
                // Hilight the hovered item
                _hover={{
                  backgroundColor: "#007050",
                  cursor: "pointer",
                }}
              >
                <HStack justifyContent="space-between">
                  <HStack>
                    {script?.iconImage && (
                      <Image
                        src={script.iconImage}
                        width="30px"
                        borderRadius="4"
                      />
                    )}
                    {!script?.iconImage && (
                      <DocumentIcon
                        color={script.iconColor || baseIconColor}
                        width="30px"
                      />
                    )}
                    <Text>{script.title}</Text>
                  </HStack>
                  <Text>
                    {formatTimestamp({ timestamp: script.timestamp })}
                  </Text>
                </HStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      )}
    </>
  );
};
