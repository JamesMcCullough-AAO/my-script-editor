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
import EditNoteIcon from "@mui/icons-material/EditNote";
import NoteIcon from "@mui/icons-material/Note";

import { useEffect, useRef, useState } from "react";
import { deleteAllScripts, deleteScript } from "./utils/deleteScript";
import { newScript } from "./utils/newScript";
import { searchSavedTitles } from "./utils/searchSavedTitles";
import { saveScript } from "./utils/saveScript";
import { importScript } from "./utils/importScript";
import { exportScript } from "./utils/exportScript";
import { formatTimestamp } from "./utils/formatTimestamp";
import { handleNewScript } from "./handlers/handleNewScript";
import { handleRenameScript } from "./handlers/handleRenameScript";
import { handleOpenRenameModal } from "./handlers/handleOpenRenameModal";
import { handleOpenMenu } from "./handlers/handleOpenMenu";
import { handleKeyDown } from "./handlers/handleKeyDown";
import { handleGenerateText } from "./handlers/handleGenerateText";
import PendingIcon from "@mui/icons-material/Pending";
import { throttle } from "lodash";
import { getScriptVersions } from "./utils/getScriptVersions";
import { formatTimestampExact } from "./utils/formatTimestampExact";
import { loadScript } from "./utils/loadScript";
import { compressImage } from "./utils/ImageCompressor";
import { EditDocumentIcon } from "./icons/editDocument";
import { DocumentIcon } from "./icons/DocumentIcon";

function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [importText, setImportText] = useState("");

  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [oldScriptTitle, setOldScriptTitle] = useState("");
  const [iconImage, setIconImage] = useState("");
  const [uploadedIconImage, setUploadedIconImage] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iconColor, setIconColor] = useState("#00FFB6" as string);
  const [savedScriptTitles, setSavedScriptTitles] = useState([
    {
      title: "",
      timestamp: 0,
      iconColor: "#00FFB6",
    },
  ] as {
    title: string;
    timestamp: number;
    iconImage?: string;
    notes?: string;
    iconColor: string;
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
      index: number;
      iconColor: string;
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
  const {
    isOpen: isNotesModalOpen,
    onOpen: onNotesModalOpen,
    onClose: onNotesModalClose,
  } = useDisclosure();

  // A function that takes uploaded image, compresses it using compressImage and sets it as the icon
  const handleUploadIcon = async (event: any) => {
    const uploadedImage = event.target.files[0];
    const compressedImage = await compressImage(uploadedImage);
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);
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

  useEffect(() => {
    if (contentRef.current) {
      saveScript({ title, contentRef, iconImage, notes, iconColor });
    }
  }, [
    contentRef.current?.innerHTML,
    contentRef.current?.innerText,
    iconImage,
    notes,
    iconColor,
  ]);

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
        saveScript({ title, contentRef, iconImage, notes, iconColor });
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

  // An icon button that accepts a color prop, and displays a document icon of that color. When clicked, it sets the icon color to that color
  const ColorIconButton = ({ color }: { color: string }) => {
    return (
      <IconButton
        colorScheme="grey"
        aria-label="Update icon"
        icon={<EditDocumentIcon color={color} width="40px" />}
        backgroundColor="blackAlpha.200"
        // on hover, change the icon color to the color of the button
        _hover={{
          backgroundColor: "blackAlpha.600",
          cursor: "pointer",
        }}
        onClick={() => {
          setIconColor(color);
          setIconImage("");
          onIconModalClose();
          onMenuClose();
        }}
      />
    );
  };

  type handleShowVersionsModalProps = {
    title: string;
  };

  const handleShowVersionsModal = async ({
    title,
  }: handleShowVersionsModalProps) => {
    const versions = await getScriptVersions(title);
    if (versions && versions.length !== 0) {
      versions.shift();
      setScriptVersions(versions);
      onVersionsModalOpen();
    } else {
      alert("No versions yet!");
    }
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
          aria-label="Edit notes"
          icon={<NoteIcon />}
          onClick={() => {
            onNotesModalOpen();
          }}
          colorScheme="yellow"
          isDisabled={isGenerating || !title}
          visibility={title ? "visible" : "hidden"}
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
          // Visiblity is hidden if there is no title or if there is no editorSettings.novelAiApiKey
          visibility={
            title && editorSettings.novelAiApiKey ? "visible" : "hidden"
          }
        />
        {isLoading && <PendingIcon />}
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
            {/* <Image src="favicon.png" width="300px" /> */}
            <EditDocumentIcon color="#00FFB6" width="300px" />
          </VStack>
        )}
        <VStack maxWidth="1000px" width="full" alignItems="start" height="100%">
          <HStack id="title-bar">
            {title && (
              <Box marginRight="5px">
                {iconImage && <Image src={iconImage} width="40px" />}
                {!iconImage && (
                  <EditDocumentIcon color={iconColor} width="40px" />
                )}
                {/* <EditDocumentIcon color="#00FFB6" width="40px" /> */}
              </Box>
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
                });
              }}
            ></div>
          </VStack>
        </VStack>
      </VStack>
      {/* Info box in the lower right corner that shows word count, updated live*/}
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="10%"
        zIndex="100"
        padding="1em"
      >
        <Text
          fontWeight={600}
          fontSize="18px"
          textAlign="right"
          color={
            wordCount > editorSettings.maxWordCount
              ? "red"
              : wordCount > editorSettings.targetWordCount
              ? "lightgreen"
              : "white"
          }
        >
          {wordCount}
        </Text>
      </Box>
      {/* Notes modal */}
      <Modal isOpen={isNotesModalOpen} onClose={onNotesModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Notes..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              height="50vh"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onNotesModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
                  colorScheme="pink"
                  icon={<HistoryIcon />}
                  onClick={async () => {
                    await handleShowVersionsModal({ title });
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
                      backgroundColor="#1d2330"
                      padding="0.5em"
                      key={script.title}
                      onClick={async () => {
                        await loadScript({
                          loadTitle: script.title,
                          title,
                          contentRef,
                          setTitle,
                          iconImage,
                          setIconImage,
                          notes,
                          setNotes,
                          setIsLoading,
                          iconColor,
                          setIconColor,
                        });
                        onMenuClose();
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
                            <Image src={script.iconImage} width="30px" />
                          )}
                          {!script?.iconImage && (
                            <DocumentIcon
                              color={script.iconColor || "#00FFB6"}
                              width="30px"
                            />
                          )}
                          {/* <Image
                            src={script.iconImage || "documentIcon.png"}
                            width="30px"
                          /> */}
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
                  setNotes,
                  setIconImage,
                  setIconColor,
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
      <Modal isOpen={isIconModalOpen} onClose={onIconModalClose} size="xl">
        <ModalOverlay />
        <ModalContent backgroundColor="#424242" color="white">
          <ModalHeader>Update Script Icon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Choose a color:</Text>
            <HStack
              spacing="2"
              marginBottom="2"
              flex="1"
              justifyContent="center"
            >
              <ColorIconButton color="#00FFB6" />
              <ColorIconButton color="#00C8FF" />
              <ColorIconButton color="#008DFF" />
              <ColorIconButton color="#FF00F1" />
              <ColorIconButton color="#FF004E" />
              <ColorIconButton color="#FF0000" />
            </HStack>
            <HStack
              spacing="2"
              marginBottom="2"
              flex="1"
              justifyContent="center"
            >
              <ColorIconButton color="#FF8B00" />
              <ColorIconButton color="#FFDC00" />
              <ColorIconButton color="#C7FF00" />
              <ColorIconButton color="#00FF0E" />
              <ColorIconButton color="#FFFFFF" />
              <ColorIconButton color="#939393" />
            </HStack>
            <Text marginTop="5">Or, upload your own icon:</Text>
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
            {window.location.hostname === "localhost" && (
              <VStack alignItems="start" spacing="0">
                <Text>NovelAI API Key (only works locally)</Text>
                <Input
                  value={editorSettings.novelAiApiKey}
                  onChange={(e) =>
                    setEditorSettings({
                      ...editorSettings,
                      novelAiApiKey: e.target.value,
                    })
                  }
                />
              </VStack>
            )}
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
            <Button
              aria-label="Delete script"
              colorScheme="red"
              onClick={() => {
                const confirmation = window.confirm(
                  "Are you sure you want to delete all scripts?"
                );
                if (confirmation) {
                  deleteAllScripts();
                  onSettingsModalClose();
                }
              }}
              isDisabled={isGenerating || !title}
            >
              {" "}
              <DeleteIcon />
              Delete All Scripts
            </Button>
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
                      onClick={async () => {
                        await loadScript({
                          loadTitle: title,
                          title,
                          contentRef,
                          setTitle,
                          setIconImage,
                          iconImage,
                          versionIndex: script.index,
                          notes,
                          setNotes,
                          setIsLoading,
                          iconColor,
                          setIconColor,
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
                          {script?.iconImage && (
                            <Image src={script.iconImage} width="30px" />
                          )}
                          {!script?.iconImage && (
                            <DocumentIcon
                              color={script.iconColor || "#00FFB6"}
                              width="30px"
                            />
                          )}
                          <Text>
                            Version{" "}
                            {scriptVersions.length -
                              scriptVersions.indexOf(script)}
                          </Text>
                        </HStack>
                        <Text>
                          {formatTimestampExact({
                            timestamp: script.timestamp,
                          })}
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
