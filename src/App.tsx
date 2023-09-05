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
import SettingsIcon from "@mui/icons-material/Settings";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HistoryIcon from "@mui/icons-material/History";

import { useEffect, useRef, useState } from "react";
import { deleteScript } from "./utils/deleteScript";
import { newScript } from "./utils/newScript";
import { searchSavedTitles } from "./utils/searchSavedTitles";
import { saveScript } from "./utils/saveScript";
import { importScript } from "./utils/importScript";
import { exportScript } from "./utils/exportScript";
import { formatTimestamp } from "./utils/formatTimestamp";
import { handleNewScript } from "./handlers/handleNewScript";
import { handleRenameScript } from "./handlers/handleRenameScript";
import { handleOpenRenameModal } from "./handlers/handleOpenRenameModal";
import { handleSelectScript } from "./handlers/handleSelectScript";
import { handleOpenMenu } from "./handlers/handleOpenMenu";
import { handleKeyDown } from "./handlers/handleKeyDown";
import { handleGenerateText } from "./handlers/handleGenerateText";
import PendingIcon from "@mui/icons-material/Pending";
import { throttle } from "lodash";
import { getScriptVersions } from "./utils/getScriptVersions";

function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isCharacterName, setIsCharacterName] = useState(false);
  const [isLineDescription, setIsLineDescription] = useState(false);
  const [importText, setImportText] = useState("");

  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [oldScriptTitle, setOldScriptTitle] = useState("");
  const [iconImage, setIconImage] = useState("");
  const [uploadedIconImage, setUploadedIconImage] = useState("");
  const [savedScriptTitles, setSavedScriptTitles] = useState([
    {
      title: "",
      timestamp: 0,
    },
  ] as {
    title: string;
    timestamp: number;
    iconImage?: string;
  }[]);
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();
  const [editorSettings, setEditorSettings] = useState({
    novelAiApiKey: "",
    targetWordCount: 0,
    maxWordCount: 0,
  });
  const [wordCount, setWordCount] = useState(0);
  const [scriptVersions, setScriptVersions] = useState([]) as [
    {
      title: string;
      timestamp: number;
      iconImage?: string;
    }[],
    any
  ];
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
  const {
    isOpen: isIconModalOpen,
    onOpen: onIconModalOpen,
    onClose: onIconModalClose,
  } = useDisclosure();
  const {
    isOpen: isSettingsModalOpen,
    onOpen: onSettingsModalOpen,
    onClose: onSettingsModalClose,
  } = useDisclosure();
  const {
    isOpen: isVersionsModalOpen,
    onOpen: onVersionsModalOpen,
    onClose: onVersionsModalClose,
  } = useDisclosure();

  // A function that takes uploaded image and sets it as the icon
  const handleUploadIcon = (event: any) => {
    const uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onloadend = () => {
      setUploadedIconImage(reader.result as string);
    };
  };

  useEffect(() => {
    const settings = localStorage.getItem("editorSettings");
    if (settings) {
      setEditorSettings(JSON.parse(settings));
    }
  }, []);

  useEffect(() => {
    const updatedScriptTitles = searchSavedTitles({ title, searchTerm });
    setSavedScriptTitles(updatedScriptTitles);
  }, [searchTerm]);

  useEffect(() => {
    if (contentRef.current) {
      saveScript({ title, contentRef, iconImage });
    }
  }, [contentRef.current?.innerHTML, contentRef.current?.innerText, iconImage]);

  const updateWordCount = throttle(() => {
    if (contentRef.current) {
      const text = contentRef.current.innerText; // Split by spaces or line breaks and remove empty elements
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word !== "");
      if (words.length !== wordCount) {
        setWordCount(words.length);
      }
    }
  }, 10000);

  useEffect(() => {
    const element = contentRef.current;

    if (element) {
      // Attach the event listener to detect changes
      element.addEventListener("input", () => {
        updateWordCount();
        saveScript({ title, contentRef });
      });

      // Update word count initially
      updateWordCount();
    }

    // Cleanup
    return () => {
      if (element) {
        element.removeEventListener("input", updateWordCount);
      }
    };
  }, []);

  useEffect(() => {
    document.title = title || "Script Editor"; // Set the title to the script title or some default title
  }, [title]); // This useEffect runs every time `title` changes

  type handleShowVersionsModalProps = {
    title: string;
  };

  const handleShowVersionsModal = ({ title }: handleShowVersionsModalProps) => {
    const versions = getScriptVersions(title);
    setScriptVersions(versions);
    onVersionsModalOpen();
  };

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
            handleGenerateText({
              contentRef,
              setIsGenerating,
              apiToken: editorSettings.novelAiApiKey,
            });
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
      {/* Script icon in top right corner fixed */}
      <Box position="absolute" top="0" right="0" width="10%" zIndex="100">
        <Image
          src={iconImage}
          width="100%"
          borderBottomLeftRadius="3xl"
          borderLeft="3px solid black"
          borderBottom="3px solid black"
        />
      </Box>
      {/* Info box in the lower right corner that shows word count, updated live*/}
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="10%"
        zIndex="100"
        padding="1em"
      >
        <Text color="white" fontWeight={600} fontSize="18px" textAlign="right">
          {wordCount}
        </Text>
      </Box>
      {/* Modal Area */}
      <Modal isOpen={isUploadModalOpen} onClose={onUploadModalClose}>
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
                onUploadModalClose();
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
                onUploadModalClose();
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
            <HStack justifyContent="space-between" mb="4">
              <HStack justifyContent="center" spacing="2">
                <IconButton
                  aria-label="Create Script"
                  icon={<NoteAddIcon />}
                  onClick={() => {
                    handleNewScript({
                      setNewScriptTitle,
                      onNameModalOpen,
                    });
                  }}
                  colorScheme="green"
                  isDisabled={isGenerating}
                />
                <IconButton
                  aria-label="Download script"
                  icon={<DownloadIcon />}
                  onClick={onUploadModalOpen}
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
                  aria-label="Upload Script Icon"
                  icon={<AddPhotoAlternateIcon />}
                  colorScheme="yellow"
                  onClick={onIconModalOpen}
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
                  aria-label="Versions"
                  colorScheme="purple"
                  icon={<HistoryIcon />}
                  onClick={() => {
                    handleShowVersionsModal({ title });
                    onMenuClose();
                  }}
                  isDisabled={isGenerating || !title}
                />
              </HStack>
              <HStack justifyContent="center" spacing="2">
                <IconButton
                  aria-label="Info Box"
                  icon={<InfoIcon />}
                  colorScheme="purple"
                  onClick={onInfoModalOpen}
                />
                <IconButton
                  aria-label="Settings"
                  icon={<SettingsIcon />}
                  colorScheme="purple"
                  onClick={onSettingsModalOpen}
                />
              </HStack>
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
                <List width="100%" spacing="1">
                  {savedScriptTitles.map((script) => (
                    <ListItem
                      border="1px solid #ccc"
                      borderRadius="0.25em"
                      backgroundColor="#1d2330"
                      padding="0.5em"
                      key={script.title}
                      onClick={() =>
                        handleSelectScript({
                          loadTitle: script.title,
                          title,
                          onMenuClose,
                          contentRef,
                          setTitle,
                          setIconImage,
                          iconImage,
                        })
                      }
                      // Hilight the hovered item
                      _hover={{
                        backgroundColor: "#007050",
                        cursor: "pointer",
                      }}
                    >
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Image
                            src={script.iconImage || "documentIcon.png"}
                            width="30px"
                          />
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
            <Text paddingTop="4" fontWeight="bold">
              --- Saving ---
            </Text>
            <Text>
              Scripts are only saved if they have at least 10 characters.
            </Text>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {/* Script icon modal - Upload the icon for the script */}
      <Modal isOpen={isIconModalOpen} onClose={onIconModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Upload Script Icon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="file"
              onChange={(event) => {
                handleUploadIcon(event);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setIconImage(uploadedIconImage);
                onIconModalClose();
              }}
            >
              Upload
            </Button>
            <Button variant="ghost" onClick={onIconModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Settings modal */}
      <Modal isOpen={isSettingsModalOpen} onClose={onSettingsModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Editor Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>NovelAI API Key</Text>
            <Input
              value={editorSettings.novelAiApiKey}
              onChange={(e) =>
                setEditorSettings({
                  ...editorSettings,
                  novelAiApiKey: e.target.value,
                })
              }
            />
            <Text>Target Word Count</Text>
            <Input
              value={editorSettings.targetWordCount}
              onChange={(e) =>
                setEditorSettings({
                  ...editorSettings,
                  targetWordCount: parseInt(e.target.value),
                })
              }
            />
            <Text>Max Word Count</Text>
            <Input
              value={editorSettings.maxWordCount}
              onChange={(e) =>
                setEditorSettings({
                  ...editorSettings,
                  maxWordCount: parseInt(e.target.value),
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                localStorage.setItem(
                  "editorSettings",
                  JSON.stringify(editorSettings)
                );
                onSettingsModalClose();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onSettingsModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Versions modal */}
      <Modal isOpen={isVersionsModalOpen} onClose={onVersionsModalClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Versions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {scriptVersions.length === 0 && <Text>No versions yet!</Text>}
            {scriptVersions.length > 0 && (
              <VStack flex="1" width="100%">
                <List width="100%" spacing="1">
                  {scriptVersions.map((script) => (
                    <ListItem
                      border="1px solid #ccc"
                      borderRadius="0.25em"
                      backgroundColor="#1d2330"
                      padding="0.5em"
                      key={scriptVersions.indexOf(script)}
                      onClick={() => {
                        handleSelectScript({
                          loadTitle: title,
                          title,
                          onMenuClose,
                          contentRef,
                          setTitle,
                          setIconImage,
                          iconImage,
                          versionIndex: scriptVersions.indexOf(script),
                        });
                        onVersionsModalClose();
                      }}
                      // Hilight the hovered item
                      _hover={{
                        backgroundColor: "#007050",
                        cursor: "pointer",
                      }}
                    >
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Image
                            src={script.iconImage || "documentIcon.png"}
                            width="30px"
                          />
                          // Reverse index version
                          <Text>
                            Version{" "}
                            {scriptVersions.length -
                              scriptVersions.indexOf(script)}
                          </Text>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default App;
