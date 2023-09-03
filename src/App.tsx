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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useEffect, useRef, useState } from "react";
import {
  exportScript,
  formatTimestamp,
  importScript,
  newScript,
  saveScript,
  searchSavedTitles,
} from "./utils";
import {
  handleGenerateText,
  handleKeyDown,
  handleOpenMenu,
  handleOpenRenameModal,
  handleRenameScript,
  handleSelectScript,
} from "./handlers";
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
  const {
    isOpen: isNameModalOpen,
    onOpen: onNameModalOpen,
    onClose: onNameModalClose,
  } = useDisclosure();

  useEffect(() => {
    const updatedScriptTitles = searchSavedTitles({ title, searchTerm });
    setSavedScriptTitles(updatedScriptTitles);
  }, [searchTerm]);

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

  useEffect(() => {
    if (contentRef.current) {
      saveScript({ title, contentRef });
    }
  }, [contentRef.current?.innerHTML]);

  const handleNewScript = () => {
    setNewScriptTitle("");
    onNameModalOpen();
  };

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
            onClick={() => {
              handleOpenMenu({
                title,
                setSavedScriptTitles,
                setSearchTerm,
                onMenuOpen,
              });
            }}
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
            visibility={title ? "visible" : "hidden"}
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
        {!title && (
          <Text
            color="white"
            fontWeight={600}
            fontSize="24px"
            textAlign="center"
          >
            Click the menu button to create a new script!
          </Text>
        )}
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
            contentEditable={!isGenerating && !!title}
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
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack justifyContent="center" mb={4} spacing="2">
              <IconButton
                aria-label="Create Script"
                icon={<NoteAddIcon />}
                onClick={() => {
                  handleNewScript();
                }}
                colorScheme="green"
                isDisabled={isGenerating}
              />
              <IconButton
                aria-label="Download script"
                icon={<DownloadIcon />}
                onClick={onOpen}
                isDisabled={isGenerating || !title}
                colorScheme="blue"
              />
              <IconButton
                aria-label="Rename script"
                icon={<DriveFileRenameOutlineIcon />}
                colorScheme="yellow"
                onClick={() =>
                  handleOpenRenameModal({
                    scriptTitle: title,
                    onMenuClose,
                    onRenameModalOpen,
                    setNewScriptTitle,
                    setOldScriptTitle,
                  })
                }
                isDisabled={isGenerating || !title}
              />
              <IconButton
                aria-label="Delete script"
                colorScheme="red"
                icon={<DeleteIcon />}
                onClick={() => {
                  onDeleteModalOpen();
                  onMenuClose();
                }}
                isDisabled={isGenerating || !title}
              />
            </HStack>
            {savedScriptTitles.length === 0 && (
              <Text>No saved scripts yet!</Text>
            )}
            {savedScriptTitles.length > 0 && (
              <VStack flex="1" width="100%">
                <Text>Saved Scripts</Text>
                <Input
                  placeholder="Search scripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                />
                <List width="100%">
                  {savedScriptTitles.map((script) => (
                    <ListItem
                      border="1px solid #ccc"
                      borderRadius="0.25em"
                      padding="0.5em"
                      key={script.title}
                      onClick={() =>
                        handleSelectScript({
                          loadTitle: script.title,
                          title,
                          onMenuClose,
                          contentRef,
                          setTitle,
                        })
                      }
                    >
                      <HStack justifyContent="space-between">
                        <Text>{script.title}</Text>
                        <Text>
                          {formatTimestamp({ timestamp: script.timestamp })}
                        </Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleRenameScript({
                  oldScriptTitle,
                  newScriptTitle,
                  onRenameModalClose,
                  setOldScriptTitle,
                  setNewScriptTitle,
                  setTitle,
                });
              }}
            >
              Rename
            </Button>
            <Button variant="ghost" onClick={onRenameModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isNameModalOpen} onClose={onNameModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Name New Script</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newScriptTitle}
              onChange={(e) => setNewScriptTitle(e.target.value)}
              placeholder="New Script Title"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                newScript({
                  newScriptTitle,
                  contentRef,
                  setTitle,
                  onMenuClose,
                  onNameModalClose,
                });
              }}
            >
              Create
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
