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
  Image,
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
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useRef, useState } from "react";
import {
  deleteScript,
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
  const {
    isOpen: isInfoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure();

  useEffect(() => {
    const updatedScriptTitles = searchSavedTitles({ title, searchTerm });
    setSavedScriptTitles(updatedScriptTitles);
  }, [searchTerm]);

  useEffect(() => {
    if (contentRef.current) {
      saveScript({ title, contentRef });
    }
  }, [contentRef.current?.innerHTML]);

  const handleNewScript = () => {
    setNewScriptTitle("");
    onNameModalOpen();
  };

  useEffect(() => {
    document.title = title || "Script Editor"; // Set the title to the script title or some default title
  }, [title]); // This useEffect runs every time `title` changes

  return (
    <HStack
      // Box should fill the entire window and expand to fit the content
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="black"
      spacing={0}
      height="100vh"
    >
      {/* Button Area */}
      <VStack
        spacing={2}
        p="2"
        backgroundColor="#1d2330"
        width="fit-content"
        alignItems="start"
        height="100vh"
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
      <VStack
        spacing={3}
        p={2}
        flex="1"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        {!title && (
          <VStack position="absolute">
            <Text
              color="white"
              fontWeight={600}
              fontSize="38px"
              textAlign="center"
            >
              Welcome to the Script Editor!
            </Text>
            <Text color="white" fontSize="16px" textAlign="center">
              Click the menu button in the top left to select a script or create
              a new one.
            </Text>
            <Image src="favicon.png" width="300px" />
          </VStack>
        )}
        <VStack maxWidth="1000px" width="full" alignItems="start" height="100%">
          <HStack id="title-bar">
            {title && (
              <Image src="favicon.png" width="40px" marginRight="5px" />
            )}
            <Text color="white" fontWeight={600} fontSize="24px">
              {title}
            </Text>
          </HStack>
          <VStack
            maxWidth="1000px"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            //Define height by parent, subtracting the height of the button area
            height={`calc(100% - ${
              (document.getElementById("title-bar")?.clientHeight || 0) + 8
            }px)`}
          >
            <div
              contentEditable={!isGenerating && !!title}
              placeholder="Type your script here..."
              style={{
                overflowY: "auto", // Enable vertical scrolling
                width: "100%",
                height: "100%",
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
          </VStack>
        </VStack>
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
                  title,
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
              <IconButton
                aria-label="Info Box"
                icon={<InfoIcon />}
                colorScheme="purple"
                onClick={onInfoModalOpen}
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
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                deleteScript({
                  title,
                  onDeleteModalClose,
                  contentRef,
                  setTitle,
                });
              }}
            >
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
      <Modal isOpen={isInfoModalOpen} onClose={onInfoModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              This is a simple script editor. All scripts are stored locally on
              your local storage.
            </Text>
            <Text paddingTop="4" fontWeight="bold">
              --- Keyboard Shortcuts ---
            </Text>
            <Text>
              <b>Tab or "["</b> - Begin a new character name <br />
              <b>Enter</b> - Finish a charcter name, start line. <br />
              <b>"]"</b> - Finish a character name, begin line description.{" "}
              <br />
              <b>")"</b> - Finish a line description, start line. <br />
            </Text>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default App;
