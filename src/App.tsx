import {
  Box,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  IconButton,
  Input,
  List,
  ListItem,
  HStack,
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import DownloadIcon from "@mui/icons-material/Download";
import CreateIcon from "@mui/icons-material/Create";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useRef, useState } from "react";
import { exportScript, importScript } from "./utils";
import { handleGenerateText, handleKeyDown } from "./handlers";
import PendingIcon from "@mui/icons-material/Pending";

function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isCharacterName, setIsCharacterName] = useState(false);
  const [isLineDescription, setIsLineDescription] = useState(false);
  const [importText, setImportText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [oldScriptTitle, setOldScriptTitle] = useState("");
  const [savedScriptTitles, setSavedScriptTitles] = useState([
    {
      title: "",
      timestamp: 0,
    },
  ]); // New state to hold saved script titles
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();

  const handleOpenMenu = () => {
    const savedScriptTitles = getSavedScriptTitles();
    setSavedScriptTitles(savedScriptTitles);
    setSearchTerm("");
    onMenuOpen();
  };

  useEffect(() => {
    const updatedScriptTitles = getSavedScriptTitles();
    setSavedScriptTitles(updatedScriptTitles);
  }, [searchTerm]);

  type handleSelectScriptInput = {
    title: string;
  };
  const handleSelectScript = ({ title }: handleSelectScriptInput) => {
    loadScript({ title });
    onMenuClose();
  };

  type saveScriptInput = {
    title: string;
  };
  const saveScript = ({ title }: saveScriptInput) => {
    if (title && contentRef.current) {
      const payload = {
        content: contentRef.current.innerHTML,
        timestamp: Date.now(),
      };
      localStorage.setItem(`script_${title}`, JSON.stringify(payload));
    }
  };

  const getSavedScriptTitles = () => {
    const savedTitles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("script_")) {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        savedTitles.push({
          title: key.substring(7),
          timestamp: data.timestamp,
        });
      }
    }
    // Sort by most recently edited and filter based on search term
    return savedTitles
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter(({ title }) => title.toLowerCase().includes(searchTerm));
  };

  const getAllSavedScripts = () => {
    const savedScripts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("script_")) {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        savedScripts.push({
          title: key.substring(7),
          content: data.content,
          timestamp: data.timestamp,
        });
      }
    }
    // Sort by most recently edited and filter based on search term
    return savedScripts.sort((a, b) => b.timestamp - a.timestamp);
  };

  const handleOpenRenameModal = (scriptTitle: string) => {
    setOldScriptTitle(scriptTitle);
    onRenameModalOpen();
  };

  const handleRenameScript = () => {
    if (newScriptTitle && oldScriptTitle && oldScriptTitle !== newScriptTitle) {
      if (
        getAllSavedScripts().some((script) => script.title === newScriptTitle)
      ) {
        alert("This title already exists!");
        return;
      }
      const scriptJSON = localStorage.getItem(`script_${oldScriptTitle}`);
      localStorage.removeItem(`script_${oldScriptTitle}`);
      localStorage.setItem(`script_${newScriptTitle}`, scriptJSON || "");
      setTitle(newScriptTitle);
    }
    setOldScriptTitle("");
    setNewScriptTitle("");
    onRenameModalClose();
  };

  const deleteScript = () => {
    // Remove script from local storage
    localStorage.removeItem(`script_${title}`);

    // Clear the input and title
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setTitle("");

    // Close the delete modal
    onDeleteModalClose();
  };

  type loadScriptInput = {
    title: string;
  };
  const loadScript = ({ title }: loadScriptInput) => {
    const savedScriptJSON = localStorage.getItem(`script_${title}`);
    if (savedScriptJSON) {
      const { content } = JSON.parse(savedScriptJSON);
      if (content && contentRef.current) {
        contentRef.current.innerHTML = content;
        setTitle(title);
      }
    }
  };

  const newScript = () => {
    const newTitle = prompt("Enter a new script title:", "");
    if (newTitle) {
      if (getAllSavedScripts().some((script) => script.title === newTitle)) {
        alert("This title already exists!");
        return;
      }
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }
      setTitle(newTitle);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      saveScript({ title });
    }
  }, [contentRef.current?.innerHTML]);

  return (
    <Box
      // Box should fill the entire window and expand to fit the content
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      backgroundColor="black"
    >
      {/* Button Area */}
      <Box position="fixed" left="1" top="50%" transform="translateY(-50%)">
        <VStack
          spacing={2}
          p={2}
          flex="1"
          height="100vh"
          justifyContent="start"
        >
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            onClick={handleOpenMenu}
            isDisabled={isGenerating}
          />
          <IconButton
            colorScheme="blue"
            aria-label="Generate text"
            icon={isGenerating ? <PendingIcon /> : <CreateIcon />}
            onClick={() => {
              handleGenerateText({ contentRef, setIsGenerating });
            }}
            isDisabled={isGenerating}
          />
        </VStack>
      </Box>
      <VStack
        spacing={3}
        p={2}
        flex="1"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="1000px">
          <Text
            color="white"
            fontWeight={600}
            fontSize="24px"
            textAlign="center"
          >
            {title}
          </Text>
        </Box>
        <Box
          flex="1"
          width="1000px" // Set the width
          height="calc(100vh - 100px)" // Set the height based on the viewport height and size of the other components
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div
            contentEditable={!isGenerating}
            placeholder="Type your script here..."
            style={{
              maxHeight: "100%", // Set the maximum height
              minHeight: "100%", // Set the minimum height
              overflowY: "auto", // Enable vertical scrolling
              width: "100%",
              backgroundColor: "#424242",
              color: "white",
              padding: "1em",
              borderRadius: "0.25em",
              fontSize: "18px",
            }}
            ref={contentRef}
            onKeyDown={(event) => {
              handleKeyDown(event, {
                contentRef,
                isCharacterName,
                setIsCharacterName,
                isLineDescription,
                setIsLineDescription,
              });
            }}
          ></div>
        </Box>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
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
                onClose();
              }}
            >
              Import
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                exportScript({
                  contentRef,
                });
                onClose();
              }}
            >
              Export
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isMenuOpen} onClose={onMenuClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack justifyContent="center" mb={4} spacing="2">
              <IconButton
                aria-label="Download script"
                icon={<DownloadIcon />}
                onClick={onOpen}
                isDisabled={isGenerating}
              />
              <IconButton
                aria-label="Create Script"
                icon={<NoteAddIcon />}
                onClick={newScript}
                isDisabled={isGenerating}
              />
              <IconButton
                aria-label="Rename script"
                icon={<EditNoteIcon />}
                onClick={() => handleOpenRenameModal(title)}
              />
              <IconButton
                aria-label="Delete script"
                colorScheme="red"
                icon={<DeleteIcon />}
                onClick={onDeleteModalOpen}
                isDisabled={isGenerating}
              />
            </HStack>
            <Text>
              {savedScriptTitles.length === 0
                ? "No saved scripts"
                : "Saved Scripts"}
            </Text>
            <Input
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
            <List spacing={3}>
              {savedScriptTitles.map((script) => (
                <ListItem
                  border="1px solid #ccc"
                  borderRadius="0.25em"
                  padding="0.5em"
                  key={script.title}
                  onClick={() => handleSelectScript({ title: script.title })}
                >
                  {script.title}
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this script?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={deleteScript}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isRenameModalOpen} onClose={onRenameModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Script</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newScriptTitle}
              onChange={(e) => setNewScriptTitle(e.target.value)}
              placeholder="New Script Title"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRenameScript}>
              Rename
            </Button>
            <Button variant="ghost" onClick={onRenameModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
