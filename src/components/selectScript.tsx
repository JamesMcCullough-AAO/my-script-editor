import {
  HStack,
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

type SelectScriptProps = {
  title: string;
  onSelect: (title: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

  useEffect(() => {
    const fetchTitles = async () => {
      setIsLoading(true);
      try {
        const updatedScriptTitles = await searchSavedTitles({
          title,
          searchTerm,
        });
        setSavedScriptTitles(updatedScriptTitles);
      } catch (error) {
        // Handle the error appropriately.
        console.error("An error occurred while fetching titles:", error);
      }
      setIsLoading(false);
    };

    fetchTitles();
  }, [searchTerm]);

  return (
    <>
      {savedScriptTitles.length === 0 && searchTerm.length == 0 && (
        <Text>No saved scripts yet!</Text>
      )}
      {(savedScriptTitles.length > 0 || searchTerm.length > 0) && (
        <VStack flex="1" width="100%">
          <Text>Saved Scripts</Text>
          <Input
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
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
